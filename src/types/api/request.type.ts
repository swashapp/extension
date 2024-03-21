import { CacheStorage } from "@/types/storage/cache.type";

export type ApiOptions = {
  headers?: HeadersInit;
  timeout: number;
};

export type Request<T> = Omit<Omit<RequestInit, "body">, "cache"> & {
  path: string;
  data?: T;
  timeout?: number;
};

export type CacheableRequest<T> = Request<T> & {
  cache?: {
    ttl: number | string;
    key?: keyof CacheStorage["data"] | string;
    volatile?: boolean;
  };
  purge?: {
    keys: (keyof CacheStorage["data"] | string)[];
  };
};
