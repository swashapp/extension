import { Banner } from 'types/storage/banner.type';

import { Entity } from './entity';

export class BannerEntity extends Entity<Banner> {
  private static instance: BannerEntity;

  public static async getInstance(): Promise<BannerEntity> {
    if (!this.instance) {
      this.instance = new BannerEntity();
      await this.instance.init();
    }
    return this.instance;
  }

  private constructor() {
    super('banner');
  }

  protected async init(): Promise<void> {
    await this.create({});
  }
}
