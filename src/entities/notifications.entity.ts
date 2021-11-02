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
    await this.create({});
  }
}
