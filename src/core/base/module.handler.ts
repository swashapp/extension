import { ModuleHandler } from "@/enums/handler.enum";
import { PlatformOS } from "@/enums/platform.enum";
import { Any } from "@/types/any.type";
import {
  CollectorBase,
  ModuleItems,
  InMemoryModules,
  ModuleCollector,
  ModuleRules,
  OnDiskModule,
} from "@/types/handler/module.type";
import { ModuleConfiguration } from "@/types/storage/configuration.type";

import { BaseScriptHandler } from "./script.handler";

export abstract class BaseModuleHandler<
  T extends ModuleHandler,
> extends BaseScriptHandler {
  protected modules = new Set<InMemoryModules<T>>();

  protected constructor(
    protected name: T,
    onDiskModules: ModuleConfiguration,
    os: PlatformOS,
  ) {
    super();

    this.logger.debug("Start initializing modules");
    for (const [category, modules] of Object.entries(onDiskModules)) {
      this.logger.debug(`Processing category ${category}`);
      this.loadCategory(os, category, modules as Record<string, OnDiskModule>);
    }
    this.logger.info("Module initialization completed");
  }

  private loadCategory(
    os: PlatformOS,
    category: string,
    modules: Record<string, OnDiskModule>,
  ) {
    for (const [name, module] of Object.entries(modules)) {
      if (!module.is_enabled) {
        this.logger.debug(
          `Skip disabled module ${name} in category ${category}`,
        );
        continue;
      }

      const onDisk = module[this.name];
      if (!onDisk) {
        this.logger.debug(
          `No configuration for module ${name} in category ${category}`,
        );
        continue;
      }

      const inMemory = this.loadItems(os, onDisk);
      if (inMemory.items.length === 0) {
        this.logger.debug(
          `No enabled items for module ${name} in category ${category}`,
        );
        continue;
      }

      const inMemoryModule = {
        name,
        category,
        description: module.description,
        is_enabled: module.is_enabled,
        anonymity_level: module.anonymity_level,
        privacy_level: module.privacy_level,
        ...inMemory,
      } as unknown as InMemoryModules<T>;

      this.modules.add(inMemoryModule);
      this.logger.debug(`Module ${name} loaded in category ${category}`);
    }
  }

  private loadItems(
    os: PlatformOS,
    module: Any,
  ): ModuleRules[T] & ModuleItems<ModuleCollector[T]> {
    this.logger.debug("Extracting module items");
    let items = [];

    if ("mapping" in module) {
      const key = module.mapping[os];
      if (key && module[key]) {
        items = module[key];
        this.logger.debug(`Mapping items found for os ${os}`);
      }
      delete module.desktop;
      delete module.mobile;
      delete module.mapping;
    } else if ("items" in module) {
      items = module.items;
      this.logger.debug("Direct items mapping found");
    }

    const enabledItems = (items as CollectorBase<ModuleCollector[T]>[]).filter(
      (item) => item.is_enabled,
    );
    this.logger.debug(`Enabled items count ${enabledItems.length}`);
    return {
      ...module,
      items: enabledItems,
    };
  }
}
