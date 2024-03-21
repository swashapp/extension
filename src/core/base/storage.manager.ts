import { storage } from 'webextension-polyfill';

import { Any } from '../../types/any.type';
import { Logger } from '../../utils/log.util';

export abstract class BaseStorageManager<T> {
  private cache!: T;
  private readonly name: string;
  private readonly initialData: T;

  protected constructor(name: string, value: T) {
    Logger.info(`Initializing "${name}"`);
    this.name = name;
    this.initialData = value;
  }

  protected serialize(cache: T): Any {
    return cache as Any;
  }

  protected deserialize(storage: Any): T {
    return storage as T;
  }

  protected async init(): Promise<void> {
    await this.create(this.initialData);
  }

  protected async create(value: T): Promise<void> {
    const _value = await storage.local.get(this.name);
    if (!(this.name in _value)) {
      const serialized = this.serialize(value);
      await storage.local.set({ [this.name]: serialized });
      this.cache = value;
      Logger.info(`"${this.name}" is created`);
    } else {
      const serializedData = _value[this.name];
      this.cache = this.deserialize(serializedData);
      Logger.info(`"${this.name}" is loaded`);
    }
  }

  public get<K extends keyof T>(
    key?: T extends string ? undefined : K,
  ): T extends string ? T : T[K] {
    if (typeof this.cache === 'string') {
      return this.cache as Any;
    }
    return this.cache[key as K] as T extends string ? T : T[K];
  }

  public getAll(): T {
    return this.cache;
  }

  public async set<K extends keyof T>(
    keyOrValue: T extends string ? T : K,
    value?: T extends string ? undefined : T[K],
  ): Promise<void> {
    if (typeof this.cache === 'string') {
      const _cache = keyOrValue as T;
      await storage.local.set({ [this.name]: this.serialize(_cache) });
      this.cache = _cache;
    } else {
      if (value === undefined || value === null) return;

      const _cache = { ...this.cache, [keyOrValue as K]: value };
      await storage.local.set({ [this.name]: this.serialize(_cache) });
      this.cache = _cache;
    }
  }

  public async setAll(value?: T): Promise<void> {
    if (value === undefined || value === null) return;

    await storage.local.set({ [this.name]: this.serialize(value) });
    this.cache = value;
  }

  protected async updateCache(): Promise<void> {
    const _value = await storage.local.get([this.name]);
    if (this.name in _value) {
      this.cache = this.deserialize(_value[this.name]);
    }
  }

  protected async updateStorage(): Promise<void> {
    await storage.local.set({ [this.name]: this.serialize(this.cache) });
  }
}
