import { tabs, Tabs } from "webextension-polyfill";

import { BaseModuleHandler } from "@/core/base/module.handler";
import { PreferenceManager } from "@/core/managers/preference.manager";
import { ModuleHandler } from "@/enums/handler.enum";
import { PlatformOS } from "@/enums/platform.enum";
import { InMemoryModules } from "@/types/handler/module.type";
import { ModuleConfiguration } from "@/types/storage/configuration.type";
import { getExtensionURL } from "@/utils/browser.util";
import { isTimeAfter } from "@/utils/date.util";
import { wildcard } from "@/utils/pattern.util";

const urls = ["chrome://newtab/", "edge://newtab/", "about:newtab"];

export class AdsHandler extends BaseModuleHandler<ModuleHandler.ADS> {
  constructor(
    onDiskModules: ModuleConfiguration,
    os: PlatformOS,
    private preferences: PreferenceManager,
  ) {
    super(ModuleHandler.ADS, onDiskModules, os);
    this.scripts = ["/core/scripts/ads.script.js"];

    this.checkAndRedirectNewTab = this.checkAndRedirectNewTab.bind(this);
    this.handleTabUpdated = this.handleTabUpdated.bind(this);
    this.getModules = this.getModules.bind(this);
  }

  private async checkAndRedirectNewTab(tab: Tabs.Tab) {
    const { status } = this.preferences.get("ads");

    if (!status.fullscreen) return;
    if (!urls.some((url) => [tab.url, tab.pendingUrl].includes(url))) return;

    await tabs.update(tab.id, {
      url: getExtensionURL("/ui/new-tab.html"),
    });
  }

  private async handleTabUpdated(
    _tabId: number,
    changeInfo: Tabs.OnUpdatedChangeInfoType,
    tab: Tabs.Tab,
  ) {
    if (changeInfo.status === "complete")
      await this.checkAndRedirectNewTab(tab);
  }

  protected override async registerContentScript() {
    await super.registerContentScript();

    if (!tabs.onCreated.hasListener(this.checkAndRedirectNewTab))
      tabs.onCreated.addListener(this.checkAndRedirectNewTab);
    if (!tabs.onUpdated.hasListener(this.handleTabUpdated))
      tabs.onUpdated.addListener(this.handleTabUpdated);
  }

  protected override async unregisterContentScript() {
    await super.unregisterContentScript();

    if (tabs.onCreated.hasListener(this.checkAndRedirectNewTab))
      tabs.onCreated.removeListener(this.checkAndRedirectNewTab);
    if (tabs.onUpdated.hasListener(this.handleTabUpdated))
      tabs.onUpdated.removeListener(this.handleTabUpdated);
  }

  public async load() {
    await this.registerContentScript();
  }

  public async unload() {
    await this.unregisterContentScript();
  }

  public async getModules(url: string) {
    const modules: InMemoryModules<ModuleHandler.ADS>[] = [];

    const { status, filters } = this.preferences.get("ads");
    const { endsAt, urls } = filters;

    if (!status.integrated || isTimeAfter(endsAt) || urls.length === 0) {
      return modules;
    }

    for (const module of this.modules) {
      let excluded = false;

      for (const item of new Set([...module.url_excludes, ...filters.urls])) {
        if (wildcard(url, item)) {
          excluded = true;
        }
      }

      if (!excluded) {
        for (const item of module.url_matches) {
          if (wildcard(url, item)) {
            const items = module.items.filter(function (item) {
              return item.is_enabled && wildcard(url, item.url_match);
            });

            modules.push({ ...module, items: items });
          }
        }
      }
    }

    return modules;
  }
}
