import { Handler } from "@/enums/handler.enum";
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
  T extends Handler,
> extends BaseScriptHandler {
  protected modules = new Set<InMemoryModules<T>>();

  protected constructor(
    protected name: T,
    onDiskModules: ModuleConfiguration,
    os: PlatformOS,
  ) {
    super();

    for (const [category, modules] of Object.entries(onDiskModules))
      this.loadCategory(os, category, modules as Record<string, OnDiskModule>);
    console.log("Loaded Modules:", Array.from(this.modules));
  }

  private loadCategory(
    os: PlatformOS,
    category: string,
    modules: Record<string, OnDiskModule>,
  ) {
    for (const [name, module] of Object.entries(modules)) {
      if (!module.is_enabled) continue;

      const onDisk = module[this.name];
      if (!onDisk) continue;

      const inMemory = this.loadItems(os, onDisk);
      if (inMemory.items.length === 0) continue;

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
    }
  }

  private loadItems(
    os: PlatformOS,
    module: Any,
  ): ModuleRules[T] & ModuleItems<ModuleCollector[T]> {
    let items = [];

    if ("mapping" in module) {
      const key = module.mapping[os];
      if (key && module[key]) items = module[key];

      delete module.desktop;
      delete module.mobile;
      delete module.mapping;
    } else if ("items" in module) {
      items = module.items;
    }

    return {
      ...module,
      items: (items as CollectorBase<ModuleCollector[T]>[]).filter(
        (item) => item.is_enabled,
      ),
    };
  }
}
