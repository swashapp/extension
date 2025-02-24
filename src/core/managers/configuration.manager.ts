import { AppCoordinator } from "@/core/app-coordinator";
import { BaseStorageManager } from "@/core/base/storage.manager";
import { InitialConfiguration } from "@/core/data/initial-configuration";
import { GetAppConfigRes } from "@/types/api/app.type";
import {
  ConfigurationStorage,
  ConfigurationStorageSchema,
} from "@/types/storage/configuration.type";

export class ConfigurationManager extends BaseStorageManager<ConfigurationStorage> {
  private static instance: ConfigurationManager;
  private updater:
    | ((last_version: string) => Promise<GetAppConfigRes>)
    | undefined;

  private constructor(protected coordinator: AppCoordinator) {
    super(InitialConfiguration);
  }

  public override async init() {
    await super.init();
    await this.update(InitialConfiguration);
  }

  private async update(config: ConfigurationStorage) {
    const { success, error } = ConfigurationStorageSchema.safeParse(config);
    if (!success) {
      this.logger.error("Invalid configuration", error);
      return;
    }

    if (BigInt(config.version) <= BigInt(this.get("version"))) {
      this.logger.warn("Configuration is already up to date");
      return;
    }

    const { last_revision } = this.get("update");
    config.update.last_revision = last_revision;

    await this.coordinator.set("isOutOfDate", true);
    await this.setAll(config);
    await this.coordinator.set("isOutOfDate", false);
    this.logger.info("Configuration updated");
  }

  private setupUpdaterJob() {
    const { interval } = this.get("update");

    setInterval(async () => {
      this.logger.debug("Start configuration update process");
      if (!this.updater) {
        this.logger.warn("Updater not defined");
        return;
      }

      const update = this.get("update");
      try {
        const data = await this.updater(update.last_revision);
        if (!data?.config || !data?.version) {
          this.logger.info("No new configuration available");
          return;
        }

        if (BigInt(data.version) > BigInt(update.last_revision)) {
          update.last_revision = `${data.version}`;
          await this.set("update", update);
          this.logger.debug("Stored updated last_revision");
        } else {
          this.logger.warn(
            `New revision ${data.version} is not greater than last_revision ${update.last_revision}`,
          );
          return;
        }

        await this.update(data.config);
      } catch (error) {
        this.logger.error("Configuration update failed", error);
      }
    }, interval);
  }

  public static async getInstance(
    coordinator: AppCoordinator,
  ): Promise<ConfigurationManager> {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager(coordinator);
      await ConfigurationManager.instance.init();
      ConfigurationManager.instance.setupUpdaterJob();
    }
    return ConfigurationManager.instance;
  }

  public setUpdater(
    updater: (last_version: string) => Promise<GetAppConfigRes>,
  ) {
    this.updater = updater;
    this.logger.debug("Updater function set");
  }
}
