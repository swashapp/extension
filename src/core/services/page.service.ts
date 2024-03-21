import { Handler } from "@/enums/handler.enum";
import { Any } from "@/types/any.type";
import { getSystemInfo } from "@/utils/browser.util";

import { AppCoordinator } from "../app-coordinator";
import { BaseScriptHandler } from "../base/script.handler";
import { AdsHandler } from "../handlers/ads.handler";
import { AjaxHandler } from "../handlers/ajax.handler";
import { BrowsingHandler } from "../handlers/browsing.handler";
import { ContentHandler } from "../handlers/content.handler";
import { ConfigurationManager } from "../managers/configuration.manager";
import { PreferenceManager } from "../managers/preference.manager";

import { DataService } from "./data.service";

export class PageService {
  private temporary: Record<string, BaseScriptHandler> = {};
  private permanent: Record<string, BaseScriptHandler> = {};

  constructor(
    protected coordinator: AppCoordinator,
    protected configs: ConfigurationManager,
    protected preferences: PreferenceManager,
    protected data: DataService,
  ) {
    this.onActiveChange = this.onActiveChange.bind(this);

    if (this.coordinator.get("isActive")) this.onActiveChange(true).then();
    this.coordinator.subscribe("isActive", this.onActiveChange);

    return new Proxy(this, {
      get: (target, prop) => {
        if (prop in target) {
          const value = (target as Any)[prop];
          if (typeof value === "function") {
            return value.bind(target);
          }
          return value;
        }

        if (
          typeof prop === "string" &&
          (prop in target.temporary || prop in target.permanent)
        ) {
          let handler = target.temporary[prop];
          if (!handler) handler = target.permanent[prop];

          return (methodName: string, ...args: Any[]) => {
            const method = (handler as Any)[methodName];
            if (typeof method === "function") return method(...args);
          };
        }
        return undefined;
      },
    });
  }

  private async onActiveChange(value: boolean): Promise<void> {
    if (value) await this.launch();
    else await this.shutdown();
  }

  private async launch(): Promise<void> {
    const modules = this.configs.get("modules");
    const { osName } = await getSystemInfo();

    this.temporary[Handler.ADS] = new AdsHandler(
      modules,
      osName,
      this.preferences,
    );
    this.temporary[Handler.AJAX] = new AjaxHandler(modules, osName, this.data);
    this.temporary[Handler.BROWSING] = new BrowsingHandler(
      modules,
      osName,
      this.data,
    );
    this.temporary[Handler.CONTENT] = new ContentHandler(modules, osName);

    for (const key in this.temporary) this.temporary[key].load();
  }

  private async shutdown(): Promise<void> {
    for (const key in this.temporary) this.temporary[key].unload();
  }
}
