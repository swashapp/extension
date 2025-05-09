import { scripting, Tabs } from "webextension-polyfill";

import { executeScript } from "@/utils/browser.util";
import { Logger } from "@/utils/log.util";

export abstract class BaseScriptHandler {
  protected scripts: string[] = [];
  protected contentScriptId = this.constructor.name;
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

  protected async registerContentScript() {
    if (this.scripts.length === 0) {
      this.logger.warn("No scripts to register");
      return;
    }
    try {
      const script = await scripting.getRegisteredContentScripts({
        ids: [this.contentScriptId],
      });
      if (script.length > 0) {
        this.logger.warn("Content script already registered");
        return;
      }

      await scripting.registerContentScripts([
        {
          id: this.contentScriptId,
          js: this.scripts,
          matches: ["http://*/*", "https://*/*"],
          runAt: "document_start",
        },
      ]);
      this.logger.info(`Registered content script`);
    } catch (error) {
      this.logger.error("Content script registration failed", error);
    }
  }

  protected async unregisterContentScript() {
    try {
      await scripting.unregisterContentScripts({
        ids: [this.contentScriptId],
      });
      this.logger.info(`Unregistered content script`);
    } catch (error) {
      this.logger.error("Content script unregistration failed", error);
    }
  }

  public abstract load(): void;
  public abstract unload(): void;
}
