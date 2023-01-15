// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import browser from 'webextension-polyfill';

import { browserUtils } from '../../utils/browser.util';
import { commonUtils } from '../../utils/common.util';
import { sAdsHelper } from '../sAdsHelper';
import { storageHelper } from '../storageHelper';

const ads = (function () {
  const cfilter = { urls: [], properties: ['status'] };

  async function initModule(module) {
    if (module.functions.includes('ads')) {
      const info = await browserUtils.getPlatformInfo();
      let platform = module.ads.os_mapping[info.os];
      if (!platform || typeof platform === 'undefined') platform = 'desktop';
      module.ads.items = module.ads[platform];
    }
  }

  async function load() {
    const modules = await storageHelper.getModules();
    for (const module in modules) {
      loadModule(modules[module]);
    }
  }

  async function unload() {
    if (browser.tabs.onUpdated.hasListener(registerSAdsScripts))
      browser.tabs.onUpdated.removeListener(registerSAdsScripts);
  }

  function loadModule(module) {
    if (module.is_enabled) {
      if (module.functions.includes('ads')) {
        for (const item of module.ads.url_matches) {
          cfilter.urls.push(item);
        }
        if (browser.tabs.onUpdated.hasListener(registerSAdsScripts))
          browser.tabs.onUpdated.removeListener(registerSAdsScripts);
        if (cfilter.urls.length > 0)
          browser.tabs.onUpdated.addListener(registerSAdsScripts);
      }
    }
  }

  function unloadModule(module) {
    function arrayRemove(arr, value) {
      return arr.filter(function (ele) {
        return ele != value;
      });
    }
    if (module.functions.includes('ads')) {
      for (const item of module.ads.url_matches) {
        cfilter.urls = arrayRemove(cfilter.urls, item);
      }
      if (browser.tabs.onUpdated.hasListener(registerSAdsScripts))
        browser.tabs.onUpdated.removeListener(registerSAdsScripts);
      if (cfilter.urls.length > 0)
        browser.tabs.onUpdated.addListener(registerSAdsScripts);
    }
  }

  function registerSAdsScripts(tabId, changeInfo, tabInfo) {
    if (changeInfo.status == 'loading') {
      let injectScript = false;
      for (const filter of cfilter.urls) {
        if (commonUtils.wildcard(tabInfo.url, filter)) {
          injectScript = true;
          break;
        }
      }
      if (!injectScript) return;
      browser.tabs
        .executeScript(tabId, {
          file: '/lib/browser-polyfill.js',
          allFrames: false,
          runAt: 'document_start',
        })
        .then((result) => {
          browser.tabs
            .executeScript(tabId, {
              file: '/core/content_scripts/ads_script.js',
              allFrames: false,
              runAt: 'document_end',
            })
            .then();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  async function getAdsInfo(url) {
    const modules = await storageHelper.getModules();
    const messages = [];
    for (const module of Object.values(modules)) {
      if (module.functions.includes('ads')) {
        if (module.is_enabled) {
          let excluded = false;
          for (const item of module.ads.url_excludes) {
            if (commonUtils.wildcard(url, item)) {
              excluded = true;
            }
          }

          if (!excluded) {
            for (const item of module.ads.url_matches) {
              if (commonUtils.wildcard(url, item)) {
                const ads = module.ads.items.filter(function (item) {
                  return (
                    item.is_enabled && commonUtils.wildcard(url, item.url_match)
                  );
                });

                for (let i = 0; i < ads.length; i++) {
                  const ad = ads[i];
                  const info = await sAdsHelper.getAdsSlots(
                    ad.size.width,
                    ad.size.height,
                  );
                  ads[i].placementId = info.uuid;
                }

                messages.push({
                  moduleName: module.name,
                  ads,
                });
              }
            }
          }
        }
      }
    }
    return messages;
  }
  return {
    initModule,
    load,
    unload,
    getAdsInfo,
  };
})();
export { ads };
