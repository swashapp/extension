import { tabs, Tabs } from 'webextension-polyfill';

import { executeScript } from '../../utils/browser.util';
import { Logger } from '../../utils/log.util';

export abstract class BaseScriptHandler {
  protected scripts: string[] = [];

  protected constructor() {
    this.execute = this.execute.bind(this);
  }

  private async execute(
    tabId: number,
    changeInfo: Tabs.OnUpdatedChangeInfoType,
  ): Promise<void> {
    if (this.scripts.length > 0 && changeInfo.status === 'loading') {
      try {
        await executeScript(tabId, this.scripts);
      } catch (err) {
        Logger.error(err);
      }
    }
  }

  protected async addScriptsListener() {
    if (!tabs.onUpdated.hasListener(this.execute))
      tabs.onUpdated.addListener(this.execute);
  }

  protected async removeScriptsListener() {
    if (tabs.onUpdated.hasListener(this.execute))
      tabs.onUpdated.removeListener(this.execute);
  }

  public abstract load(): void;

  public abstract unload(): void;
}
