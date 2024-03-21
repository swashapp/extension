import { WebRequest } from 'webextension-polyfill';

import { Handler } from '../../enums/handler.enum';
import { StreamCategory } from '../../enums/stream.enum';
import { PlatformMap } from '../platform.type';

import { AdsDisplayCollector } from './ads.type';
import { AjaxCollector } from './ajax.type';
import { BrowsingCollector } from './browsing.type';
import { ContentCollector } from './content.type';

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
  [Handler.ADS]: AdsDisplayCollector;
  [Handler.AJAX]: AjaxCollector;
  [Handler.BROWSING]: BrowsingCollector;
  [Handler.CONTENT]: ContentCollector;
};

export type ModuleRules = {
  [Handler.ADS]: MatchBaseModule & ExcludeBaseModule;
  [Handler.AJAX]: MatchBaseModule &
    FilterBaseModule<WebRequest.OnCompletedOptions>;
  [Handler.BROWSING]: FilterBaseModule<WebRequest.OnBeforeRequestOptions>;
  [Handler.CONTENT]: MatchBaseModule;
};

export type OnDiskModule = ModuleBase & {
  [Handler.ADS]?: ModuleRules[Handler.ADS] &
    ModuleMappedItems<ModuleCollector[Handler.ADS]>;
  [Handler.AJAX]?: ModuleRules[Handler.AJAX] &
    ModuleItems<ModuleCollector[Handler.AJAX]>;
  [Handler.BROWSING]?: ModuleRules[Handler.BROWSING] &
    ModuleItems<ModuleCollector[Handler.BROWSING]>;
  [Handler.CONTENT]?: ModuleRules[Handler.CONTENT] &
    ModuleMappedItems<ModuleCollector[Handler.CONTENT]>;
};

export type InMemoryModules<T extends keyof ModuleCollector> =
  InMemoryModulesBase & ModuleRules[T] & ModuleItems<ModuleCollector[T]>;
