import { ConfigurationStorage } from '../../types/storage/configuration.type';
import { AppCoordinator } from '../app-coordinator';
import { BaseStorageManager } from '../base/storage.manager';
import { InitialConfiguration } from '../data/initial-configuration';

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
