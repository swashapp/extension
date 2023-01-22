import { AdsConfig, PausedAdInfo } from '../types/storage/ads-config.type';

import { Entity } from './entity';

export class AdsEntity extends Entity<AdsConfig> {
  private static instance: AdsEntity;

  public static async getInstance(): Promise<AdsEntity> {
    if (!this.instance) {
      this.instance = new AdsEntity();
      await this.instance.init();
    }
    return this.instance;
  }

  private constructor() {
    super('ads');
  }

  protected async init(): Promise<void> {
    await this.create({
      status: {
        fullScreen: false,
        pushNotification: false,
        integratedDisplay: false,
      },
      paused: {},
    });
  }

  public async upgrade(): Promise<void> {}

  public async addPaused(name: string, value: PausedAdInfo): Promise<void> {
    if (Object.keys(this.cache.paused).includes(name)) {
      this.cache.paused[name].push(value);
    } else {
      this.cache.paused[name] = [value];
    }
    await this.saveCache();
  }

  public async removeOldPause(): Promise<void> {
    for (const key of Object.keys(this.cache.paused)) {
      const paused = this.cache.paused[key].filter((item: PausedAdInfo) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { until } = item;
        if (until && until < new Date().getTime()) {
          return false;
        }
        return true;
      });
      this.cache.paused[key] = paused;
    }
    await this.saveCache();
  }
}
