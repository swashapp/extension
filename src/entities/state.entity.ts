import { State } from '../types/storage/state.type';

import { Entity } from './entity';

export class StateEntity extends Entity<State> {
  private static instance: StateEntity;

  public static async getInstance(): Promise<StateEntity> {
    if (!this.instance) {
      this.instance = new StateEntity();
      await this.instance.init();
    }
    return this.instance;
  }

  private constructor() {
    super('state');
  }

  protected async init(): Promise<void> {
    await this.create({
      serverTimestamp: { value: 0, expire: 0 },
      lastConfigUpdate: 0,
      lastUserJoin: 0,
      lastNotificationUpdate: 0,
      messageSession: { id: '', expire: 0 },
      streamSessionToken: '',
    });
  }
}
