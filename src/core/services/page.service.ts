import { BaseScriptHandler } from "@/core/base/script.handler";
import { AdsHandler } from "@/core/handlers/ads.handler";
import { AjaxHandler } from "@/core/handlers/ajax.handler";
import { BrowsingHandler } from "@/core/handlers/browsing.handler";
import { ContentHandler } from "@/core/handlers/content.handler";
import { SdkHandler } from "@/core/handlers/sdk.handler";
import { ModuleHandler, OtherHandler } from "@/enums/handler.enum";
import { Any } from "@/types/any.type";
import { Managers } from "@/types/app.type";
import { getSystemInfo } from "@/utils/browser.util";
import { Logger } from "@/utils/log.util";

import { DataService } from "./data.service";

export class PageService {
  private temporary: Record<string, BaseScriptHandler> = {};
  private permanent: Record<string, BaseScriptHandler> = {};
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    protected managers: Managers,
    protected data: DataService,
  ) {
    this.logger.info("Starting initialization");

    this.onActiveChange = this.onActiveChange.bind(this);

    this.permanent[OtherHandler.SDK] = new SdkHandler();
    this.logger.debug("Launching permanent handlers");
    for (const key in this.permanent) {
      this.logger.debug(`Loading permanent handler: ${key}`);
      this.permanent[key].load();
      this.logger.debug(`Permanent handler loaded: ${key}`);
    }
    this.logger.info("Permanent handlers launched");

    this.managers.coordinator.subscribe(
      "isOutOfDate",
      async (value, oldValue) => {
        if (value !== oldValue && !value) {
          this.logger.info("Updating configuration");
          await this.shutdown();
          await this.launch();
          this.logger.info("Configuration updated");
        }
      },
    );

    this.onActiveChange(this.managers.coordinator.get("isActive")).then();
    this.managers.coordinator.subscribe("isActive", this.onActiveChange);

    this.logger.info("Initialization completed");

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

  private async onActiveChange(active: boolean): Promise<void> {
    if (active) {
      this.logger.debug("Launching temporary handlers");
      await this.launch();
      this.logger.info("Temporary handlers launched");
    } else {
      this.logger.debug("Shutting down temporary handlers");
      await this.shutdown();
      this.logger.info("Temporary handlers shutdown completed");
    }
  }

  private async launch(): Promise<void> {
    const { osName } = await getSystemInfo();

    this.temporary[ModuleHandler.ADS] = new AdsHandler(
      this.managers.configs.get("modules"),
      osName,
      this.managers.preferences,
    );
    this.temporary[ModuleHandler.AJAX] = new AjaxHandler(
      this.managers.configs.get("modules"),
      osName,
      this.data,
    );
    this.temporary[ModuleHandler.BROWSING] = new BrowsingHandler(
      this.managers.configs.get("modules"),
      osName,
      this.data,
    );

    this.temporary[ModuleHandler.CONTENT] = new ContentHandler(
      this.managers.configs.get("modules"),
      osName,
    );

    for (const key in this.temporary) {
      this.logger.debug(`Loading temporary handler: ${key}`);
      this.temporary[key].load();
      this.logger.debug(`Temporary handler loaded: ${key}`);
    }
  }

  private async shutdown(): Promise<void> {
    for (const key in this.temporary) {
      this.logger.debug(`Unloading temporary handler: ${key}`);
      this.temporary[key].unload();
      this.logger.debug(`Temporary handler unloaded: ${key}`);
    }
  }
}
