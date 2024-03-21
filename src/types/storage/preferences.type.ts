import { AdsFilters, AdsType } from "@/types/ads.type";
import {
  NewTabDateTime,
  NewTabSearchEngine,
  NewTabSite,
} from "@/types/new-tab.type";

export type AdsPreferences = {
  status: AdsType;
  filters: AdsFilters;
};

export type NewTabPreferences = {
  background: string;

  datetime: NewTabDateTime;
  search_engine: NewTabSearchEngine;
  sites: Record<number, NewTabSite>;
};

export type PreferencesStorage = {
  delay: number;

  ads: AdsPreferences;
  new_tab: NewTabPreferences;
  charities: string[];
};
