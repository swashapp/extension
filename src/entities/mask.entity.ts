import { PrivacyData } from '../types/storage/privacy-data.type';

import { Entity } from './entity';

export class MaskEntity extends Entity<PrivacyData[]> {
  private static instance: MaskEntity;

  public static async getInstance(): Promise<MaskEntity> {
    if (!this.instance) {
      this.instance = new MaskEntity();
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
