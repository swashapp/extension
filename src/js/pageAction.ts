import browser from 'webextension-polyfill';

import { Tabs } from 'webextension-polyfill/namespaces/tabs';

import { FilterType } from '../enums/filter.enum';
import { Filter } from '../types/filter.type';

import { browserUtils } from './browserUtils';
import { filterUtils } from './filterUtils';
import { memberManager } from './memberManager';
import { storageHelper } from './storageHelper';

import Tab = Tabs.Tab;

const pageAction = (function () {
  async function isDomainFiltered(tabInfo: Tab) {
    if (!tabInfo.url) return;
    const domain = new URL(tabInfo.url);
    const f = {
      value: `*://${domain.host}/*`,
      type: 'wildcard',
      internal: false,
    };
    const filter: Filter[] = await storageHelper.retrieveFilters();
    for (const i in filter) {
      if (
        filter[i].value === f.value &&
        filter[i].type === f.type &&
        filter[i].internal === f.internal
      ) {
        return true;
      }
    }
    return false;
  }

  async function isCurrentDomainFiltered() {
    const tabs = await browser.tabs.query({
      active: true,
      windowId: browser.windows.WINDOW_ID_CURRENT,
    });
    if (!tabs[0].id) return;
    const tab = await browser.tabs.get(tabs[0].id);
    return isDomainFiltered(tab);
  }

  function loadIcons(url?: string) {
    if (!url) return;
    browserUtils.isMobileDevice().then((res) => {
      if (!res) {
        storageHelper.retrieveConfigs().then((configs) => {
          if (configs.is_enabled) {
            if (memberManager.isJoined() === true) {
              storageHelper.retrieveFilters().then((filters) => {
                if (filterUtils.filter(url, filters))
                  browser.browserAction.setIcon({
                    path: {
                      '38': 'icons/mono_mark_38.png',
                      '19': 'icons/mono_mark_19.png',
                    },
                  });
                else
                  browser.browserAction.setIcon({
                    path: {
                      '38': 'icons/green_mark_38.png',
                      '19': 'icons/green_mark_19.png',
                    },
                  });
              });
            } else {
              browser.browserAction.setIcon({
                path: {
                  '38': 'icons/error_mark_38.png',
                  '19': 'icons/error_mark_19.png',
                },
              });
            }
          } else {
            browser.browserAction.setIcon({
              path: {
                '38': 'icons/mono_mark_38.png',
                '19': 'icons/mono_mark_19.png',
              },
            });
          }
        });
      }
    });
  }

  async function handleFilter() {
    const tabs = await browser.tabs.query({
      active: true,
      windowId: browser.windows.WINDOW_ID_CURRENT,
    });
    if (!tabs[0].id) return;
    const tab = await browser.tabs.get(tabs[0].id);
    return isDomainFiltered(tab).then((res) => {
      if (res) {
        removeFilter(tab);
        return false;
      } else {
        addFilter(tab);
        return true;
      }
    });
  }

  function addFilter(tab: Tab) {
    if (!tab.url) return;
    const domain = new URL(tab.url);
    if (
      !domain.host ||
      typeof domain.host === 'undefined' ||
      domain.host === ''
    ) {
      return;
    }
    const f = {
      value: `*://${domain.host}/*`,
      type: FilterType.Wildcard,
      internal: false,
    };

    let allow = true;
    storageHelper.retrieveFilters().then((filter: Filter[]) => {
      for (const i in filter) {
        if (filter[i].value === f.value) {
          allow = false;
        }
      }
      if (allow) {
        filter.push(f);
        storageHelper.storeFilters(filter).then(() => {
          loadIcons(tab.url);
        });
      }
    });
  }

  function removeFilter(tab: Tab) {
    if (!tab.url) return;
    const domain = new URL(tab.url);
    const f = {
      value: `*://${domain.host}/*`,
      type: 'wildcard',
      internal: false,
    };
    if (!f.value || f.value === 'undefined') {
      return;
    }

    storageHelper.retrieveFilters().then((filters) => {
      filters = filters.filter((fl: Filter) => {
        if (
          fl.value !== f.value ||
          fl.type !== f.type ||
          fl.internal !== f.internal
        ) {
          return fl;
        }
      });

      storageHelper.storeFilters(filters).then(() => {
        loadIcons(tab.url);
      });
    });
  }

  return {
    isCurrentDomainFiltered,
    loadIcons,
    handleFilter,
    addFilter,
    removeFilter,
  };
})();

export { pageAction };
