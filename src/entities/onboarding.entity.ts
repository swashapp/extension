import { Onboarding } from '../types/storage/onboarding.type';

import { Entity } from './entity';

export class OnboardingEntity extends Entity<Onboarding> {
  private static instance: OnboardingEntity;

  public static async getInstance(): Promise<OnboardingEntity> {
    if (!this.instance) {
      this.instance = new OnboardingEntity();
      await this.instance.init();
    }
    return this.instance;
  }

  private constructor() {
    super('onboarding');
  }

  protected async init(): Promise<void> {
    await this.create({});
  }
}
