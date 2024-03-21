import { AppCoordinator } from "@/core/app-coordinator";
import { BaseStorageManager } from "@/core/base/storage.manager";
import { InitialConfiguration } from "@/core/data/initial-configuration";
import { ConfigurationStorage } from "@/types/storage/configuration.type";

export class ConfigurationManager extends BaseStorageManager<ConfigurationStorage> {
  private static instance: ConfigurationManager;

  private constructor(protected coordinator: AppCoordinator) {
    super(ConfigurationManager.name, InitialConfiguration);
  }

  public static async getInstance(
    coordinator: AppCoordinator,
  ): Promise<ConfigurationManager> {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager(coordinator);
      await ConfigurationManager.instance.init();
    }
    return ConfigurationManager.instance;
  }
}
