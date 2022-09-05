import { Charity } from '../types/storage/charity.type';

import { Entity } from './entity';

export class CharityEntity extends Entity<Charity[]> {
  private static instance: CharityEntity;

  public static async getInstance(): Promise<CharityEntity> {
    if (!this.instance) {
      this.instance = new CharityEntity();
      await this.instance.init();
    }
    return this.instance;
  }

  private constructor() {
    super('charity');
  }

  protected async init(): Promise<void> {
    await this.create([]);
  }
}
