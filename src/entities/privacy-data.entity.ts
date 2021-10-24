import { PrivacyData } from '../types/storage/privacy-data.type';

import { Entity } from './entity';

export class PrivacyDataEntity extends Entity<PrivacyData[]> {
  private static instance: PrivacyDataEntity;

  public static async getInstance(): Promise<PrivacyDataEntity> {
    if (!this.instance) {
      this.instance = new PrivacyDataEntity();
      await this.instance.init();
    }
    return this.instance;
  }

  private constructor() {
    super('privacyData');
  }

  protected async init(): Promise<void> {
    await this.create([]);
  }
}
