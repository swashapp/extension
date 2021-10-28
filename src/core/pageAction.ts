import browser from 'webextension-polyfill';

import { FilterType } from '../enums/filter.enum';
import { Any } from '../types/any.type';
import { Filter } from '../types/storage/filter.type';
import { browserUtils } from '../utils/browser.util';
import { filterUtils } from '../utils/filter.util';

import { memberManager } from './memberManager';
import { storageHelper } from './storageHelper';

const pageAction = (function () {
  async function isDomainFiltered(tabInfo: Any) {
    if (!tabInfo.url) return;
    const domain = new URL(tabInfo.url);
    const f = {
      value: `*://${domain.host}/*`,
      type: 'wildcard',
      internal: false,
    };
    const filter: Filter[] = await storageHelper.getFilters();
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
        storageHelper.getConfigs().then((configs) => {
          if (configs.is_enabled) {
            if (memberManager.isJoined() === true) {
              storageHelper.getFilters().then((filters) => {
                if (filterUtils.filter(url, filters))
                  browser.browserAction.setIcon({
                    path: {
                      '16': 'static/images/swash/inactive-16.png',
                      '48': 'static/images/swash/inactive-48.png',
                    },
                  });
                else
                  browser.browserAction.setIcon({
                    path: {
                      '16': 'static/images/swash/active-16.png',
                      '48': 'static/images/swash/active-48.png',
                    },
                  });
              });
            } else {
              browser.browserAction.setIcon({
                path: {
                  '16': 'static/images/swash/error-16.png',
                  '48': 'static/images/swash/error-48.png',
                },
              });
            }
          } else {
            browser.browserAction.setIcon({
              path: {
                '16': 'static/images/swash/inactive-16.png',
                '48': 'static/images/swash/inactive-48.png',
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

  function addFilter(tab: Any) {
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
    storageHelper.getFilters().then((filter: Filter[]) => {
      for (const i in filter) {
        if (filter[i].value === f.value) {
          allow = false;
        }
      }
      if (allow) {
        filter.push(f);
        storageHelper.saveFilters(filter).then(() => {
          loadIcons(tab.url);
        });
      }
    });
  }

  function removeFilter(tab: Any) {
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

    storageHelper.getFilters().then((filters) => {
      filters = filters.filter((fl: Filter) => {
        if (
          fl.value !== f.value ||
          fl.type !== f.type ||
          fl.internal !== f.internal
        ) {
          return fl;
        }
      });

      storageHelper.saveFilters(filters).then(() => {
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
