import { BaseModuleHandler } from "@/core/base/module.handler";
import { ModuleHandler } from "@/enums/handler.enum";
import { PlatformOS } from "@/enums/platform.enum";
import { InMemoryModules } from "@/types/handler/module.type";
import { ModuleConfiguration } from "@/types/storage/configuration.type";
import { wildcard } from "@/utils/pattern.util";

export class ContentHandler extends BaseModuleHandler<ModuleHandler.CONTENT> {
  constructor(onDiskModules: ModuleConfiguration, os: PlatformOS) {
    super(ModuleHandler.CONTENT, onDiskModules, os);
    this.scripts = ["/core/scripts/content.script.js"];

    this.getModules = this.getModules.bind(this);
  }

  public async load() {
    await this.registerContentScript();
  }

  public async unload() {
    await this.unregisterContentScript();
  }

  public async getModules(url: string) {
    const modules: InMemoryModules<ModuleHandler.CONTENT>[] = [];

    for (const module of this.modules) {
      for (const item of module.url_matches) {
        if (wildcard(url, item)) {
          const items = module.items.filter((item) =>
            wildcard(url, item.url_match),
          );
          modules.push({ ...module, items });
        }
      }
    }

    return modules;
  }
}
