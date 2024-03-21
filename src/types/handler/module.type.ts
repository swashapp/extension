import { WebRequest } from "webextension-polyfill";

import { ModuleHandler } from "@/enums/handler.enum";
import { StreamCategory } from "@/enums/stream.enum";
import { PlatformMap } from "@/types/platform.type";

import { AdsDisplayCollector } from "./ads.type";
import { AjaxCollector } from "./ajax.type";
import { BrowsingCollector } from "./browsing.type";
import { ContentCollector } from "./content.type";

export type CollectorBase<T> = {
  name: string;
  title: string;
  description: string;
  is_enabled: boolean;
} & T;

export type ModuleItems<T> = { items: CollectorBase<T>[] };

export type ModuleMappedItems<T> =
  | {
      mapping: PlatformMap;
      desktop: CollectorBase<T>[];
      mobile?: CollectorBase<T>[];
    }
  | {
      mapping: PlatformMap;
      mobile: CollectorBase<T>[];
      desktop?: CollectorBase<T>[];
    };

type ModuleBase = {
  description: string;
  is_enabled: boolean;
  anonymity_level: number;
  privacy_level: number;
};

export type InMemoryModulesBase = {
  name: string;
  category: StreamCategory;
} & ModuleBase;

export type FilterBaseModule<T> = {
  filter: WebRequest.RequestFilter;
  extra_info_spec: T[];
};

export type FilterBaseItem<T> = {
  filter?: WebRequest.RequestFilter;
  extra_info_spec?: T[];
};

export type MatchBaseModule = {
  url_matches: string[];
};

export type ExcludeBaseModule = {
  url_excludes: string[];
};

export type ModuleCollector = {
  [ModuleHandler.ADS]: AdsDisplayCollector;
  [ModuleHandler.AJAX]: AjaxCollector;
  [ModuleHandler.BROWSING]: BrowsingCollector;
  [ModuleHandler.CONTENT]: ContentCollector;
};

export type ModuleRules = {
  [ModuleHandler.ADS]: MatchBaseModule & ExcludeBaseModule;
  [ModuleHandler.AJAX]: MatchBaseModule &
    FilterBaseModule<WebRequest.OnCompletedOptions>;
  [ModuleHandler.BROWSING]: FilterBaseModule<WebRequest.OnBeforeRequestOptions>;
  [ModuleHandler.CONTENT]: MatchBaseModule;
};

export type OnDiskModule = ModuleBase & {
  [ModuleHandler.ADS]?: ModuleRules[ModuleHandler.ADS] &
    ModuleMappedItems<ModuleCollector[ModuleHandler.ADS]>;
  [ModuleHandler.AJAX]?: ModuleRules[ModuleHandler.AJAX] &
    ModuleItems<ModuleCollector[ModuleHandler.AJAX]>;
  [ModuleHandler.BROWSING]?: ModuleRules[ModuleHandler.BROWSING] &
    ModuleItems<ModuleCollector[ModuleHandler.BROWSING]>;
  [ModuleHandler.CONTENT]?: ModuleRules[ModuleHandler.CONTENT] &
    ModuleMappedItems<ModuleCollector[ModuleHandler.CONTENT]>;
};

export type InMemoryModules<T extends keyof ModuleCollector> =
  InMemoryModulesBase & ModuleRules[T] & ModuleItems<ModuleCollector[T]>;
