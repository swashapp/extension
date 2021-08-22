// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { browserUtils } from './browserUtils';
import { filterUtils } from './filterUtils';
import { memberManager } from './memberManager';
import { storageHelper } from './storageHelper';

const pageAction = (function () {
  async function isDomainFiltered(tabInfo) {
    const domain = new URL(tabInfo.url);
    const f = {
      value: `*://${domain.host}/*`,
      type: 'wildcard',
      internal: false,
    };
    const filter = await storageHelper.retrieveFilters();
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
    const tab = await browser.tabs.get(tabs[0].id);
    return isDomainFiltered(tab);
  }

  function loadIcons(url) {
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

  function addFilter(tab) {
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
      type: 'wildcard',
      internal: false,
    };

    let allow = true;
    storageHelper.retrieveFilters().then((filter) => {
      for (const i in filter) {
        if (filter[i].value === f.value) {
          allow = false;
        }
      }
      if (allow) {
        filter.push(f);
        storageHelper.storeFilters(filter).then((res) => {
          loadIcons(tab.url);
        });
      }
    });
  }

  function removeFilter(tab) {
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
      filters = filters.filter((fl) => {
        if (
          fl.value !== f.value ||
          fl.type !== f.type ||
          fl.internal !== f.internal
        ) {
          return fl;
        }
      });

      storageHelper.storeFilters(filters).then((res) => {
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
