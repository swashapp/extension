import { storage } from "webextension-polyfill";

import { Any } from "@/types/any.type";
import { Logger } from "@/utils/log.util";

export abstract class BaseStorageManager<T> {
  private cache!: T;
  private readonly name: string;
  private readonly initialData: T;
  protected readonly logger = new Logger(this.constructor.name);

  protected constructor(value: T) {
    this.name = this.constructor.name.replace("Manager", "").toLowerCase();
    this.initialData = value;
    this.logger.info("Initialization completed");
  }

  protected serialize(cache: T): Any {
    return cache as Any;
  }

  protected deserialize(storageData: Any): T {
    return storageData as T;
  }

  protected async init(): Promise<void> {
    this.logger.debug("Start init process");
    await this.create(this.initialData);
    this.logger.debug("Init process completed");
  }

  protected async create(value: T): Promise<void> {
    this.logger.debug(`Fetch local storage data`);
    const storedData = await storage.local.get(this.name);
    if (!(this.name in storedData)) {
      this.logger.info(`No storage record, creating new record`);
      const serialized = this.serialize(value);
      await storage.local.set({ [this.name]: serialized });
      this.cache = value;
      this.logger.info("Storage record created");
    } else {
      this.logger.info(`Storage record exists, loading data`);
      const serializedData = storedData[this.name];
      this.cache = this.deserialize(serializedData);
    }
  }

  public get<K extends keyof T>(
    key?: T extends string ? undefined : K,
  ): T extends string ? T : T[K] {
    if (typeof this.cache === "string") {
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
    if (typeof this.cache === "string") {
      this.logger.debug("Update record");
      const newCache = keyOrValue as T;
      await storage.local.set({ [this.name]: this.serialize(newCache) });
      this.cache = newCache;
    } else {
      if (value === undefined || value === null) return;
      this.logger.debug(`Update record at key ${String(keyOrValue)}`);
      const newCache = { ...this.cache, [keyOrValue as K]: value };
      await storage.local.set({ [this.name]: this.serialize(newCache) });
      this.cache = newCache;
    }
  }

  public async setAll(value?: T): Promise<void> {
    if (value === undefined || value === null) return;
    this.logger.debug("Update storage");
    await storage.local.set({ [this.name]: this.serialize(value) });
    this.cache = value;
  }
}
