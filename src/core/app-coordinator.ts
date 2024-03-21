import { AccountStages } from '../enums/account.enum';
import { SystemMessage } from '../enums/message.enum';
import { InternalPaths } from '../paths';
import { Any } from '../types/any.type';
import { AppStates, CoordinatorCallback } from '../types/coordinator.type';
import { getExtensionURL, openInNewTab } from '../utils/browser.util';
import { Logger } from '../utils/log.util';

import { BaseStorageManager } from './base/storage.manager';
import { BaseError } from './base-error';

export class AppCoordinator extends BaseStorageManager<AppStates> {
  private static instance: AppCoordinator;

  private observers: Map<keyof AppStates, CoordinatorCallback<Any>[]> =
    new Map();

  private constructor() {
    super(AppCoordinator.name, {
      stage: AccountStages.INITIAL,
      isActive: false,
      isOutOfDate: false,
    });
  }

  public static async getInstance(): Promise<AppCoordinator> {
    if (!this.instance) {
      this.instance = new AppCoordinator();
      await this.instance.init();
    }
    return this.instance;
  }

  private notify<K extends keyof AppStates>(
    key: K,
    value: AppStates[K],
    oldValue: AppStates[K],
  ): void {
    const observers = this.observers.get(key);
    if (observers) {
      observers.forEach((observer) => observer(value, oldValue));
    }
  }

  public subscribe<K extends keyof AppStates>(
    key: K,
    callback: CoordinatorCallback<AppStates[K]>,
  ): void {
    Logger.info(`${key} has a new subscriber`);
    if (!this.observers.has(key)) {
      this.observers.set(key, []);
    }
    this.observers.get(key)!.push(callback);
    Logger.info(`${key} has been subscribed`, this.observers.get(key));
  }

  public unsubscribe<K extends keyof AppStates>(
    key: K,
    callback: CoordinatorCallback<AppStates[K]>,
  ): void {
    const observers = this.observers.get(key);
    if (observers) {
      this.observers.set(
        key,
        observers.filter((observer) => observer !== callback),
      );
    }
  }

  public async set<K extends keyof AppStates>(
    key: K,
    value: AppStates[K],
  ): Promise<void> {
    if (!this.isReady() && key === 'isActive' && value === true)
      throw new BaseError(SystemMessage.NOT_READY_APP);

    const oldValue = super.get(key);
    await super.set(key, value);
    this.notify(key, value, oldValue);
  }

  public isInOnboarding(openTab: boolean = false): boolean {
    const isInOnboardingMode = [
      AccountStages.INITIAL,
      AccountStages.ONBOARDING,
      AccountStages.REGISTERED,
    ].includes(this.get('stage'));

    if (isInOnboardingMode && openTab)
      openInNewTab(getExtensionURL(InternalPaths.onboarding)).then();
    return isInOnboardingMode;
  }

  public isReady() {
    return this.get('stage') === AccountStages.READY;
  }
}
