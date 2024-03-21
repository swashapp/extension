import { CacheStorage } from "@/types/storage/cache.type";

export type ApiOptions = {
  headers?: HeadersInit;
  timeout: number;
};

export type RequestOptions<T> = Omit<Omit<RequestInit, "body">, "cache"> & {
  data?: T;
  timeout?: number;
};

export type CacheRequestOptions<T> = RequestOptions<T> & {
  cache?: {
    ttl: number;
    key?: keyof CacheStorage["data"] | string;
    refresh?: boolean;
  };
};
