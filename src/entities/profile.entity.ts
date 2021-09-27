import { Profile } from '../types/storage/profile.type';

import { Entity } from './entity';

export class ProfileEntity extends Entity<Profile> {
  private static instance: ProfileEntity;

  public static async getInstance(): Promise<ProfileEntity> {
    if (!this.instance) {
      this.instance = new ProfileEntity();
      await this.instance.init();
    }
    return this.instance;
  }

  private constructor() {
    super('profile');
  }

  protected async init(): Promise<void> {
    await this.create({});
  }
}
