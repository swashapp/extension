import { AdsConfig } from '../types/storage/ads-config.type';

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
    });
  }

  public async upgrade(): Promise<void> {}
}
