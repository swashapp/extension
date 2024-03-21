import { BaseError } from "@/base-error";
import { AppStages } from "@/enums/app.enum";
import { SystemMessage } from "@/enums/message.enum";
import { INTERNAL_PATHS } from "@/paths";
import { Any } from "@/types/any.type";
import { AppStates, CoordinatorCallback } from "@/types/coordinator.type";
import { getExtensionURL, openInNewTab } from "@/utils/browser.util";

import { BaseStorageManager } from "./base/storage.manager";

export class AppCoordinator extends BaseStorageManager<AppStates> {
  private static instance: AppCoordinator;

  private observers: Map<keyof AppStates, CoordinatorCallback<Any>[]> =
    new Map();

  private constructor() {
    super({
      stage: AppStages.INITIAL,
      isActive: false,
      isOutOfDate: false,
    });

    this.subscribe("stage", (stage) => {
      if (stage !== AppStages.READY) this.openPendingFlow();
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
    if (observers)
      observers.forEach((observer) => {
        this.logger.debug(`Notifying ${key} observer`, observer);
        observer(value, oldValue);
      });
  }

  public subscribe<K extends keyof AppStates>(
    key: K,
    callback: CoordinatorCallback<AppStates[K]>,
  ): void {
    this.logger.info(`A new subscribe request for ${key} arrived`);
    if (!this.observers.has(key)) {
      this.observers.set(key, []);
    }
    this.observers.get(key)!.push(callback);
    this.logger.info(`${key} has a new subscriber`, this.observers.get(key));
  }

  public unsubscribe<K extends keyof AppStates>(
    key: K,
    callback: CoordinatorCallback<AppStates[K]>,
  ): void {
    this.logger.info(`A new unsubscribe request for ${key} arrived`);
    const observers = this.observers.get(key);
    if (observers) {
      this.observers.set(
        key,
        observers.filter((observer) => observer !== callback),
      );
      this.logger.info(
        `${key} subscriber list updated`,
        this.observers.get(key),
      );
    }
  }

  public async set<K extends keyof AppStates>(
    key: K,
    value: AppStates[K],
  ): Promise<void> {
    this.logger.info(`Trying to set ${key} to ${value}`);
    if (!this.isReady() && key !== "stage")
      throw new BaseError(SystemMessage.NOT_READY_APP);

    const oldValue = super.get(key);
    await super.set(key, value);
    this.logger.info(`${key} has been set to ${value}`);
    this.notify(key, value, oldValue);
  }

  public isReady() {
    return this.get("stage") === AppStages.READY;
  }

  public openPendingFlow(): void {
    if (this.get("stage") === AppStages.ONBOARDING) {
      this.logger.info("Opening onboarding page");
      openInNewTab(getExtensionURL(INTERNAL_PATHS.onboarding)).then();
    } else if (this.get("stage") === AppStages.MIGRATING) {
      this.logger.info("Opening migration page");
      openInNewTab(getExtensionURL(INTERNAL_PATHS.upgrade)).then();
    }
  }
}
