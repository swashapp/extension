import { AppCoordinator } from "@/core/app-coordinator";
import { BaseStorageManager } from "@/core/base/storage.manager";
import { InitialPreferences } from "@/core/data/initial-preferences";
import { AdsType } from "@/types/ads.type";
import {
  NewTabDateTime,
  NewTabSearchEngine,
  NewTabSite,
} from "@/types/new-tab.type";
import { PreferencesStorage } from "@/types/storage/preferences.type";
import { getTimestamp } from "@/utils/date.util";

export class PreferenceManager extends BaseStorageManager<PreferencesStorage> {
  private static instance: PreferenceManager;

  private constructor(protected coordinator: AppCoordinator) {
    super(InitialPreferences);
  }

  public static async getInstance(
    coordinator: AppCoordinator,
  ): Promise<PreferenceManager> {
    if (!PreferenceManager.instance) {
      PreferenceManager.instance = new PreferenceManager(coordinator);
      await PreferenceManager.instance.init();
    }
    return PreferenceManager.instance;
  }

  public async setAdsStatus(status: AdsType) {
    const ads = this.get("ads");
    await this.set("ads", { ...ads, status });
  }

  public async addAdsFilter(url: string): Promise<void> {
    const ads = this.get("ads");
    const urls = new Set(ads.filters.urls);
    urls.add(`*://${new URL(url).host}/*`);

    await this.set("ads", {
      status: { ...ads.status },
      filters: { endsAt: ads.filters.endsAt, urls: [...urls] },
    });
  }

  public async removeAdsFilter(url: string) {
    const ads = this.get("ads");
    const urls = new Set(ads.filters.urls);
    urls.delete(`*://${new URL(url).host}/*`);

    await this.set("ads", {
      status: { ...ads.status },
      filters: { endsAt: ads.filters.endsAt, urls: [...urls] },
    });
  }

  public async pauseAd(seconds: number) {
    const ads = this.get("ads");
    ads.filters.endsAt = getTimestamp() + seconds * 1000;

    await this.set("ads", ads);
  }

  public async setNewTabBackground(background: string) {
    const newtab = this.get("new_tab");
    await this.set("new_tab", { ...newtab, background });
  }

  public async setNewTabSearchEngine(search_engine: NewTabSearchEngine) {
    const newtab = this.get("new_tab");
    await this.set("new_tab", { ...newtab, search_engine });
  }

  public async setNewTabDatetime(datetime: NewTabDateTime) {
    const newtab = this.get("new_tab");
    await this.set("new_tab", { ...newtab, datetime });
  }

  public async addNewTabSite(id: number, site: NewTabSite) {
    const newtab = this.get("new_tab");
    await this.set("new_tab", {
      ...newtab,
      sites: { ...newtab.sites, [id]: site },
    });
  }

  public async removeNewTabSite(id: number) {
    const newtab = this.get("new_tab");
    delete newtab.sites[id];
    await this.set("new_tab", { ...newtab });
  }

  public getFavoriteCharities() {
    return this.get("charities");
  }

  public async addCharityToFavorite(id: string) {
    const charities = new Set(this.get("charities"));
    charities.add(id);

    await this.set("charities", [...charities].sort());
  }

  public async removeCharityToFavorite(id: string) {
    const charities = new Set(this.get("charities"));
    charities.delete(id);

    await this.set("charities", [...charities].sort());
  }
}
