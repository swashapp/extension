import { storage } from "webextension-polyfill";

import { Any } from "@/types/any.type";
import { Logger } from "@/utils/log.util";
import { copy } from "@/utils/object.util";

export abstract class BaseStorageManager<T> {
  private _cache!: T;
  private readonly name: string;
  private readonly initialData: T;
  protected readonly logger = new Logger(this.constructor.name);

  private set cache(value: T) {
    this._cache = this.deserialize(copy(value));
  }

  private get cache(): T {
    return this.deserialize(copy(this._cache));
  }

  private async write(data: T) {
    await storage.local.set({ [this.name]: this.serialize(data) });
    this.cache = data;
  }

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
    const local = await storage.local.get(this.name);
    if (!(this.name in local)) {
      this.logger.info(`No storage record, creating new record`);
      await this.setAll(value);
      this.logger.info("Storage record created");
    } else {
      this.logger.info(`Storage record exists, loading data`);
      this.cache = local[this.name];
    }
  }

  public get<K extends keyof T>(
    key?: T extends string ? undefined : K,
  ): T extends string ? T : T[K] {
    const data = this.cache;

    if (typeof data === "string") return data as Any;
    return data[key as K] as T extends string ? T : T[K];
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
      await this.write(keyOrValue as T);
    } else {
      if (value === undefined || value === null) return;
      this.logger.debug(`Update record at key ${String(keyOrValue)}`);
      await this.write({ ...this.cache, [keyOrValue as K]: value });
    }
  }

  public async setAll(value?: T): Promise<void> {
    if (value === undefined || value === null) return;
    await this.write(value);
  }
}
