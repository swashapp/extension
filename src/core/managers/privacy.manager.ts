import { Tabs, tabs } from "webextension-polyfill";

import { AppCoordinator } from "@/core/app-coordinator";
import { BaseStorageManager } from "@/core/base/storage.manager";
import { InitialFilters } from "@/core/data/initial-filters";
import { MatchType } from "@/enums/pattern.enum";
import { FilterStorage, PrivacyStorage } from "@/types/storage/privacy.type";
import { getExtensionURL, setBrowserIcon } from "@/utils/browser.util";
import { match } from "@/utils/filter.util";

export class PrivacyManager extends BaseStorageManager<PrivacyStorage> {
  private static instance: PrivacyManager;

  private constructor(protected coordinator: AppCoordinator) {
    super(PrivacyManager.name, {
      filters: InitialFilters,
      masks: [],
    });

    this.onActiveChange = this.onActiveChange.bind(this);
    this.onTabUpdate = this.onTabUpdate.bind(this);
    this.onTabActivate = this.onTabActivate.bind(this);
  }

  public static async getInstance(
    coordinator: AppCoordinator,
  ): Promise<PrivacyManager> {
    if (!PrivacyManager.instance) {
      PrivacyManager.instance = new PrivacyManager(coordinator);
      await PrivacyManager.instance.init();
    }
    return PrivacyManager.instance;
  }

  private updateAppIcon(url?: string) {
    const isInactive =
      !url ||
      !this.coordinator.get("isActive") ||
      match(url, this.get("filters"));
    const status = isInactive ? "inactive" : "active";
    const sizes = ["16", "48", "96"];

    const paths = sizes.reduce(
      (acc, size) => {
        acc[size] = getExtensionURL(`images/swash/${status}-${size}.png`);
        return acc;
      },
      {} as Record<string, string>,
    );

    setBrowserIcon({ path: paths });
  }

  private onActiveChange() {
    this.updateAppIcon();
  }

  private onTabUpdate(
    _tabId: number,
    changeInfo: Tabs.OnUpdatedChangeInfoType,
    tab: Tabs.Tab,
  ) {
    if (!changeInfo.url || !tab.active) return;
    this.updateAppIcon(tab.url);
  }

  private async onTabActivate(activeInfo: Tabs.OnActivatedActiveInfoType) {
    this.updateAppIcon((await tabs.get(activeInfo.tabId))?.url);
  }

  protected async init() {
    await super.init();

    this.coordinator.subscribe("isActive", this.onActiveChange);
    if (!tabs.onUpdated.hasListener(this.onTabUpdate))
      tabs.onUpdated.addListener(this.onTabUpdate);
    if (!tabs.onActivated.hasListener(this.onTabActivate))
      tabs.onActivated.addListener(this.onTabActivate);
    this.updateAppIcon(
      (await tabs.query({ active: true, currentWindow: true }))?.[0]?.url,
    );
  }

  private createFilter(url: string): FilterStorage {
    return {
      value: `*://${new URL(url).host}/*`,
      type: MatchType.Wildcard,
      immutable: false,
    };
  }

  public getFilters(): string[] {
    return this.get("filters")
      .filter((fl) => !fl.immutable)
      .map((fl) => fl.value);
  }

  public async addFilter(url: string): Promise<void> {
    const filter = this.createFilter(url);
    const exists = this.get("filters").some((fl) => fl.value === filter.value);

    if (!exists) await this.set("filters", [...this.get("filters"), filter]);
  }

  public async removeFilter(url: string) {
    const filter = this.createFilter(url);
    const filters = this.get("filters").filter(
      (fl) =>
        fl.value !== filter.value ||
        fl.type !== filter.type ||
        fl.immutable !== filter.immutable,
    );

    if (this.get("filters").length !== filters.length)
      await this.set("filters", [...filters]);
  }

  public async addMask(mask: string) {
    const masks = new Set(this.get("masks"));
    masks.add(mask);

    await this.set("masks", [...masks].sort());
  }

  public async removeMask(mask: string) {
    const masks = new Set(this.get("masks"));
    masks.delete(mask);

    await this.set("masks", [...masks].sort());
  }
}
