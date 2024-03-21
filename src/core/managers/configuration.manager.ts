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

  private setupUpdaterJob() {
    const { interval } = this.get("update");
    setInterval(() => this.update(), interval);
  }

  private async update() {
    this.logger.debug("Start configuration update process");
    if (!this.updater) {
      this.logger.warn("Updater not defined");
      return;
    }
    const { last_revision } = this.get("update");
    try {
      const data = await this.updater(last_revision);
      if (!data?.config) {
        this.logger.info("No new configuration available");
        return;
      }

      if (data?.version !== last_revision) {
        const update = this.get("update");
        update.last_revision = data.version;
        await this.set("update", update);
        this.logger.debug("Stored updated last_revision");
      }

      const config = data.config as ConfigurationStorage;
      if (config.version === this.get("version")) {
        this.logger.warn("Configuration is already up to date");
        return;
      }

      const { success, error } = ConfigurationStorageSchema.safeParse(config);
      if (!success) {
        this.logger.error("Invalid configuration", error);
        return;
      }

      config.update.last_revision = data.version;
      await this.coordinator.set("isOutOfDate", true);
      await this.setAll(config);
      await this.coordinator.set("isOutOfDate", false);
      this.logger.info("Configuration updated");
    } catch (error) {
      this.logger.error("Configuration update failed", error);
    }
  }

  public setUpdater(
    updater: (last_version: string) => Promise<GetAppConfigRes>,
  ) {
    this.updater = updater;
    this.logger.debug("Updater function set");
  }
}
