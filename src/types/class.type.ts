import { Any } from "./any.type";

type FunctionType = (...args: Any[]) => Any;

export type ClassAsyncType<T> = {
  [K in keyof T]: T[K] extends FunctionType
    ? (...args: Parameters<T[K]>) => Promise<ReturnType<T[K]>>
    : never;
};
