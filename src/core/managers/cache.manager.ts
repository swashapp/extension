import { BaseError } from "@/base-error";
import { AppCoordinator } from "@/core/app-coordinator";
import { BaseStorageManager } from "@/core/base/storage.manager";
import { InitialCache } from "@/core/data/initial-cache";
import { SystemMessage } from "@/enums/message.enum";
import { Any } from "@/types/any.type";
import { CacheStorage, TimeBasedCache } from "@/types/storage/cache.type";

export class CacheManager extends BaseStorageManager<CacheStorage> {
  private static instance: CacheManager;

  private constructor(protected coordinator: AppCoordinator) {
    super(InitialCache);
  }

  public static async getInstance(
    coordinator: AppCoordinator,
  ): Promise<CacheManager> {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager(coordinator);
      await CacheManager.instance.init();
    }
    return CacheManager.instance;
  }

  protected serialize(cache: CacheStorage): Any {
    return {
      ...cache,
      data: this.serializeTimeBasedCacheMap(cache.data),
      tokens: this.serializeTimeBasedCacheMap(cache.session),
    };
  }

  protected deserialize(storage: Any): CacheStorage {
    return {
      ...storage,
      data: this.deserializeTimeBasedCacheMap(storage.data),
      session: this.deserializeTimeBasedCacheMap(storage.session),
    };
  }

  private serializeTimeBasedCacheMap(
    map: Record<string, TimeBasedCache<Any>>,
  ): Record<string, Any> {
    const serializedMap: Record<string, Any> = {};
    for (const key in map) {
      if (Object.prototype.hasOwnProperty.call(map, key)) {
        serializedMap[key] = map[key].toJSON();
      }
    }
    return serializedMap;
  }

  private deserializeTimeBasedCacheMap(
    map: Record<string, Any>,
  ): Record<string, TimeBasedCache<Any>> {
    const deserializedMap: Record<string, TimeBasedCache<Any>> = {};
    for (const key in map) {
      if (Object.prototype.hasOwnProperty.call(map, key)) {
        deserializedMap[key] = TimeBasedCache.fromJSON(map[key]);
      }
    }
    return deserializedMap;
  }

  public async pull<T>(
    key: string,
    options: { ttl: number | string; volatile?: boolean },
    onMiss: () => Promise<T>,
  ): Promise<T> {
    const data = this.get("data");
    const cached = data[key] as TimeBasedCache<T>;
    if (cached && !cached.isExpired) {
      this.logger.info(`Cache hit for ${key}`);
      this.logger.debug(`Cache value: ${cached.value}`);
      return cached.value;
    }

    this.logger.info(`Cache miss for ${key}`);
    const value = await onMiss();
    this.logger.debug(`New value: ${value}`);
    await this.setData(key, value, options);
    return value;
  }

  public getData<K extends keyof CacheStorage["data"]>(
    key: K,
  ): CacheStorage["data"][K]["value"] {
    const data = this.get("data");
    return data[key].value;
  }

  public async setData<K extends keyof CacheStorage["data"]>(
    key: K,
    value: CacheStorage["data"][K]["value"],
    { ttl, volatile }: { ttl: number | string; volatile?: boolean },
  ): Promise<void> {
    const data = this.get("data");
    await this.set("data", {
      ...data,
      [key]: new TimeBasedCache(value, ttl, volatile),
    });
    this.logger.debug(`Data updated for key ${key} for ${ttl}ms`);
  }

  public async clearData(key: keyof CacheStorage["data"]) {
    const data = this.get("data");
    delete data[key];
    await this.set("data", data);
    this.logger.debug(`Data cleared for key ${key}`);
  }

  public async clearVolatileData() {
    this.logger.info("Clearing volatile data");
    const data = this.get("data");
    for (const key in data) {
      if (data[key].volatile) {
        delete data[key];
        this.logger.debug(`Volatile data removed for key ${key}`);
      }
    }
    await this.set("data", data);
    this.logger.info("Volatile data cleared");
  }

  public async setTempEmail(email: string) {
    if (this.coordinator.isReady()) {
      throw new BaseError(SystemMessage.NOT_ALLOWED_REASSIGN_EMAIL);
    }
    const account = this.getData("account");
    await this.setData("account", { ...account, email }, { ttl: 0 });
    this.logger.info("Temporary email set");
  }

  public getSession(key: keyof CacheStorage["session"]) {
    const cached = this.get("session")[key];
    if (cached && !cached.isExpired) {
      this.logger.debug(`Session hit for ${key}`);
      return cached.value;
    }
    this.logger.debug(`Session miss for ${key}`);
    return undefined;
  }

  public async setSession(
    key: keyof CacheStorage["session"],
    value: string,
    ttl: number,
  ) {
    await this.set("session", {
      ...this.get("session"),
      [key]: new TimeBasedCache(value, ttl),
    });
    this.logger.debug(`Session updated for key ${key} for ${ttl}ms`);
  }

  public async clearSession(key: keyof CacheStorage["session"]) {
    const tokens = this.get("session");
    delete tokens[key];
    await this.set("session", tokens);
    this.logger.debug(`Session cleared for key ${key}`);
  }
}
