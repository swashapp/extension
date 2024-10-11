// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import browser from 'webextension-polyfill';

import { AdsEntity } from '../../entities/ads.entity';
import { browserUtils } from '../../utils/browser.util';
import { commonUtils } from '../../utils/common.util';
import { adsHelper } from '../adsHelper';
import { storageHelper } from '../storageHelper';
import { userHelper } from '../userHelper';

const ads = (function () {
  const afilter = { urls: [], properties: ['status'] };

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
          afilter.urls.push(item);
        }
        if (browser.tabs.onUpdated.hasListener(registerSAdsScripts))
          browser.tabs.onUpdated.removeListener(registerSAdsScripts);
        if (afilter.urls.length > 0)
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
        afilter.urls = arrayRemove(afilter.urls, item);
      }
      if (browser.tabs.onUpdated.hasListener(registerSAdsScripts))
        browser.tabs.onUpdated.removeListener(registerSAdsScripts);
      if (afilter.urls.length > 0)
        browser.tabs.onUpdated.addListener(registerSAdsScripts);
    }
  }

  async function registerSAdsScripts(tabId, changeInfo, tabInfo) {
    const { integratedDisplay } = (await storageHelper.getAdsConfig()).status;
    if (!integratedDisplay) return;

    if (changeInfo.status == 'loading') {
      let injectScript = false;
      for (const filter of afilter.urls) {
        if (commonUtils.wildcard(tabInfo.url, filter)) {
          injectScript = true;
          break;
        }
      }

      if (!injectScript) return;
      browserUtils
        .injectScript(tabId, [
          '/lib/browser-polyfill.js',
          '/core/content_scripts/ads_script.js',
        ])
        .catch((err) => {
          console.error(err);
        });
    }
  }

  async function getAdsInfo(url) {
    const { paused } = await storageHelper.getAdsConfig();
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
                const allAds = module.ads.items.filter(function (item) {
                  return (
                    item.is_enabled && commonUtils.wildcard(url, item.url_match)
                  );
                });

                const ads = allAds.filter((ad) => {
                  if (Object.keys(paused).includes(ad.name)) {
                    for (const item of paused[ad.name]) {
                      const { domain, until } = item;
                      if (domain && commonUtils.wildcard(url, domain)) {
                        return false;
                      } else if (until && until > new Date().getTime()) {
                        return false;
                      }
                    }
                  }
                  return true;
                });

                for (let i = 0; i < ads.length; i++) {
                  const ad = ads[i];
                  const info = await adsHelper.getAdsSlots(
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
    const adsEntity = await AdsEntity.getInstance();
    await adsEntity.removeOldPause();

    return messages;
  }

  async function pauseAds(type, value) {
    const adsEntity = await AdsEntity.getInstance();
    const time = value.split(' ');

    const now = new Date().getTime();
    let until = +time[0];

    switch (time[1].toLocaleLowerCase()) {
      case 'minute':
      case 'minutes':
        until *= 60;
        break;
      case 'hour':
      case 'hours':
        until *= 3600;
        break;
      default:
        break;
    }

    await adsEntity.addPaused(type, { until: now + until * 1000 });
  }

  async function excludeDomain(type, domain) {
    const adsEntity = await AdsEntity.getInstance();

    const url = new URL(domain);
    await adsEntity.addPaused(type, { domain: `*://${url.host}/*` });
  }

  return {
    initModule,
    load,
    unload,
    getAdsInfo,
    pauseAds,
    excludeDomain,
  };
})();
export { ads };
