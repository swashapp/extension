import { SystemMessage } from '../../enums/message.enum';
import { Any } from '../../types/any.type';
import { TimeBasedCache } from '../../types/storage/cache.type';
import { CacheStorage } from '../../types/storage/cache.type';
import { AppCoordinator } from '../app-coordinator';
import { BaseStorageManager } from '../base/storage.manager';
import { BaseError } from '../base-error';
import { InitialCache } from '../data/initial-cache';

export class CacheManager extends BaseStorageManager<CacheStorage> {
  private static instance: CacheManager;

  private constructor(protected coordinator: AppCoordinator) {
    super(CacheManager.name, InitialCache);
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
    ttl: number,
    refresh: boolean = false,
    onMiss: () => Promise<T>,
  ): Promise<T> {
    const data = this.get('data');
    const cached = data[key] as TimeBasedCache<T>;
    if (!refresh && cached && !cached.isExpired) return cached.value;

    const value = await onMiss();
    await this.setData(key, value, ttl);

    return value;
  }

  public getData<K extends keyof CacheStorage['data']>(
    key: K,
  ): CacheStorage['data'][K]['value'] {
    const data = this.get('data');
    return data[key].value;
  }

  public async setData<K extends keyof CacheStorage['data']>(
    key: K,
    value: CacheStorage['data'][K]['value'],
    ttl: number,
  ): Promise<void> {
    const data = this.get('data');

    await this.set('data', {
      ...data,
      [key]: new TimeBasedCache(value, ttl),
    });
  }

  public async setTempEmail(email: string) {
    if (this.coordinator.isReady())
      throw new BaseError(SystemMessage.NOT_ALLOWED_REASSIGN_EMAIL);
    const account = this.getData('account');
    await this.setData('account', { ...account, email }, 0);
  }

  public getSession(key: keyof CacheStorage['session']) {
    const cached = this.get('session')[key];
    if (cached && !cached.isExpired) return cached.value;
    return undefined;
  }

  public async setSession(
    key: keyof CacheStorage['session'],
    value: string,
    ttl: number,
  ) {
    await this.set('session', {
      ...this.get('session'),
      [key]: new TimeBasedCache(value, ttl),
    });
  }

  public async clearSession(key: keyof CacheStorage['session']) {
    const tokens = this.get('session');

    delete tokens[key];
    await this.set('session', tokens);
  }
}
