import urlJoin from "url-join";

import { BaseError } from "@/base-error";
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

  async fetch<I, O>(
    request: CacheableRequest<I>,
    transformer: (response: Response) => Promise<O>,
  ): Promise<O>;
  async fetch<I>(request: CacheableRequest<I>): Promise<Response>;
  async fetch<I, O>(
    request: CacheableRequest<I>,
    transformer?: (response: Response) => O,
  ): Promise<O | Response> {
    const cache = request.cache;
    const purge = request.purge;

    delete request.cache;
    delete request.purge;

    let response: O | Response;
    if (this.cache && cache && transformer) {
      this.logger.debug("Using cache for API request");
      const { method, path, data } = request;
      const {
        key = `${method}:${path}${data ? `:${hash(HashAlgorithm.SHA256, JSON.stringify(data))}` : ""}`,
        ...options
      } = cache;
      response = await this.cache.pull<O>(key, options, async () =>
        this.transform(await this.request(request), transformer),
      );
    } else {
      this.logger.debug("No cache for API request");
      response = await this.transform(await this.request(request), transformer);
    }

    if (this.cache && purge) {
      for (const key of purge.keys) {
        await this.cache.clearData(key);
        this.logger.debug("Cleared cache for key");
      }
    }

    this.logger.info("API fetch completed");
    return response;
  }
}
