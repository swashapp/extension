import { Notifications } from 'types/storage/notifications.type';

import { Entity } from './entity';

export class NotificationsEntity extends Entity<Notifications> {
  private static instance: NotificationsEntity;

  public static async getInstance(): Promise<NotificationsEntity> {
    if (!this.instance) {
      this.instance = new NotificationsEntity();
      await this.instance.init();
    }
    return this.instance;
  }

  private constructor() {
    super('notifications');
  }

  protected async init(): Promise<void> {
    await this.create({ inApp: {}, push: [] });
  }

  public async upgrade(): Promise<void> {
    for (const key of Object.keys(this.cache)) {
      if (['inApp', 'push'].includes(key)) continue;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.cache.inApp[key] = this.cache[key];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete this.cache[key];
    }
    return this.save(this.cache);
  }
}
