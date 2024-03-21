import { ExceptionHandler } from '../../decorators/exception-handler';
import { RequestMethod } from '../../enums/api.enum';
import { SystemMessage } from '../../enums/message.enum';
import { Any } from '../../types/any.type';
import {
  ApiOptions,
  CacheRequestOptions,
  RequestOptions,
} from '../../types/api/request.type';
import { BaseError } from '../base-error';
import { CacheManager } from '../managers/cache.manager';

@ExceptionHandler()
export class ApiService {
  constructor(
    private baseUrl: string,
    private options: ApiOptions,
    private cache?: CacheManager,
  ) {}

  private async request<I>(
    path: string,
    options: RequestOptions<I>,
  ): Promise<Response> {
    const { method, headers = {}, timeout, data, ...other } = options;

    const controller = new AbortController();
    const id = setTimeout(
      () => controller.abort(),
      timeout ?? this.options.timeout,
    );

    const req: RequestInit = {
      method: method,
      headers: { ...this.options.headers, ...headers },
      signal: controller.signal,
      ...other,
    };

    let url = new URL(path, this.baseUrl).toString();
    if (
      (options.method === RequestMethod.GET ||
        options.method === RequestMethod.DELETE) &&
      data
    ) {
      const params = new URLSearchParams(data).toString();
      url = `${url}?${params}`;
    } else if (data) {
      if (data instanceof FormData || data instanceof File) req.body = data;
      else req.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, req);
      if (response.status >= 500)
        throw new BaseError(SystemMessage.FAILED_API_CALL);

      return response;
    } catch (error: Any) {
      if (error.name === 'AbortError') {
        throw new BaseError(SystemMessage.TIMEOUT_API_CALL);
      }
      throw error;
    } finally {
      clearTimeout(id);
    }
  }

  private async transform(
    response: Response,
    transformer?: (response: Response) => Any,
  ) {
    if (transformer) return transformer(response);
    else return response;
  }

  async fetch<I, O>(
    path: string,
    options: CacheRequestOptions<I>,
    transformer: (response: Response) => Promise<O>,
  ): Promise<O>;

  async fetch<I>(
    path: string,
    options: CacheRequestOptions<I>,
  ): Promise<Response>;

  async fetch<I, O>(
    path: string,
    options: CacheRequestOptions<I>,
    transformer?: (response: Response) => O,
  ): Promise<O | Response> {
    const cache = options.cache;
    delete options.cache;

    if (this.cache && cache && transformer) {
      const key = cache.key ?? `${options.method}:${path}`;
      return await this.cache.pull<O>(key, cache.ttl, cache.refresh, async () =>
        this.transform(await this.request(path, options), transformer),
      );
    }
    return this.transform(await this.request(path, options), transformer);
  }
}
