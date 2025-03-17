import urlJoin from "url-join";

import { BaseError } from "@/base-error";
import { Mutex } from "@/core/base/mutex.lock";
import { CacheManager } from "@/core/managers/cache.manager";
import { ExceptionHandler } from "@/decorators/exception-handler";
import { RequestMethod } from "@/enums/api.enum";
import { SystemMessage } from "@/enums/message.enum";
import { HashAlgorithm } from "@/enums/security.enum";
import { Any } from "@/types/any.type";
import {
  ApiOptions,
  CacheableRequest,
  Request,
} from "@/types/api/request.type";
import { Logger } from "@/utils/log.util";
import { hash } from "@/utils/security.util";

@ExceptionHandler()
export class ApiService {
  private readonly logger = new Logger(this.constructor.name);
  private readonly mutexes: Record<string, Mutex> = {};

  constructor(
    private baseUrl: string,
    private options: ApiOptions,
    private cache?: CacheManager,
  ) {
    this.logger.info("Initialization completed");
  }

  private async request<I>(request: Request<I>): Promise<Response> {
    this.logger.debug("Start API request");
    const { method, path, headers = {}, timeout, data, ...other } = request;

    const controller = new AbortController();
    const id = setTimeout(
      () => controller.abort(),
      timeout ?? this.options.timeout,
    );

    const req: RequestInit = {
      method,
      headers: { ...this.options.headers, ...headers },
      signal: controller.signal,
      ...other,
    };

    let url = urlJoin(this.baseUrl, path);
    if (
      (request.method === RequestMethod.GET ||
        request.method === RequestMethod.DELETE) &&
      data
    ) {
      const params = new URLSearchParams(data).toString();
      url = `${url}?${params}`;
    } else if (data) {
      if (data instanceof FormData || data instanceof File) {
        req.body = data;
      } else {
        req.body = JSON.stringify(data);
      }
    }

    try {
      this.logger.debug("Sending API request");
      const response = await fetch(url, req);
      if (response.status >= 500) {
        this.logger.error("API call failed with server error", response.status);
        throw new BaseError(SystemMessage.FAILED_API_CALL);
      }
      this.logger.debug("API response received");
      return response;
    } catch (error: Any) {
      if (error.name === "AbortError") {
        this.logger.error("API request timed out");
        throw new BaseError(SystemMessage.TIMEOUT_API_CALL);
      }
      this.logger.error("API request error", error);
      throw error;
    } finally {
      clearTimeout(id);
      this.logger.debug("Cleared request timeout");
    }
  }

  private async transform(
    response: Response,
    transformer?: (response: Response) => Any,
  ) {
    this.logger.debug("Transforming API response");
    if (transformer) return transformer(response);
    else return response;
  }

  public async fetch<I, O>(
    request: CacheableRequest<I>,
    transformer: (response: Response) => Promise<O>,
  ): Promise<O>;
  public async fetch<I>(request: CacheableRequest<I>): Promise<Response>;
  public async fetch<I, O>(
    request: CacheableRequest<I>,
    transformer?: (response: Response) => O,
  ): Promise<O | Response> {
    const cache = request.cache;
    const purge = request.purge;

    delete request.cache;
    delete request.purge;

    let response: O | Response;
    const { method, path, data } = request;
    const hashKey = `${method}:${path}${data ? `:${hash(HashAlgorithm.SHA256, JSON.stringify(data))}` : ""}`;

    if (this.cache && cache && transformer) {
      this.logger.info(`Cache API request for ${hashKey}`);
      const { key = hashKey, ...options } = cache;
      try {
        this.logger.debug(`Locking mutex for ${key}`);
        if (!this.mutexes[key]) this.mutexes[key] = new Mutex();
        await this.mutexes[key].lock();
        this.logger.debug(`Locked mutex for ${key}`);

        response = await this.cache.pull<O>(key, options, async () => {
          this.logger.info(`API request for ${hashKey}`);
          return this.transform(await this.request(request), transformer);
        });
      } finally {
        this.mutexes[key].unlock();
        this.logger.debug(`Unlocked mutex for ${key}`);
      }
    } else {
      this.logger.info(`API request for ${hashKey}`);
      response = await this.transform(await this.request(request), transformer);
    }

    if (this.cache && purge) {
      for (const key of purge.keys) {
        await this.cache.clearData(key);
        this.logger.debug(`Cleared ${key} cache after ${hashKey}`);
      }
    }

    this.logger.info(`API request completed for ${hashKey}`);
    return response;
  }
}
