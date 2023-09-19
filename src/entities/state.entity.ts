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
      lastInAppNotificationUpdate: 0,
      lastPushNotificationUpdate: { timestamp: 0, check: 0 },
      lastPushNotificationRaise: 0,
      messageSession: { id: '', expire: 0 },
      streamSessionToken: '',
    });
  }

  public async upgrade(): Promise<void> {
    this.cache.lastInAppNotificationUpdate =
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.cache['lastNotificationUpdate'];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete this.cache['lastNotificationUpdate'];
    return this.save(this.cache);
  }
}
