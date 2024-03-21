import { tabs, Tabs } from "webextension-polyfill";

import { executeScript } from "@/utils/browser.util";
import { Logger } from "@/utils/log.util";

export abstract class BaseScriptHandler {
  protected scripts: string[] = [];
  protected readonly logger = new Logger(this.constructor.name);

  protected constructor() {
    this.execute = this.execute.bind(this);
    this.logger.info(`Initialization completed`);
  }

  private async execute(
    tabId: number,
    { status, url }: Tabs.OnUpdatedChangeInfoType,
  ): Promise<void> {
    if (
      this.scripts.length > 0 &&
      status === "loading" &&
      (url?.startsWith("http") || url?.startsWith("https"))
    ) {
      try {
        await executeScript(tabId, this.scripts);
        this.logger.debug(`Executed scripts on tab ${tabId}`);
      } catch (error) {
        this.logger.error(`Script execution failed`, error);
      }
    }
  }

  protected async addScriptsListener() {
    if (!tabs.onUpdated.hasListener(this.execute)) {
      tabs.onUpdated.addListener(this.execute);
      this.logger.debug("Added script listener");
    }
  }

  protected async removeScriptsListener() {
    if (tabs.onUpdated.hasListener(this.execute)) {
      tabs.onUpdated.removeListener(this.execute);
      this.logger.debug("Removed script listener");
    }
  }

  public abstract load(): void;
  public abstract unload(): void;
}
