// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import browser from 'webextension-polyfill';

import { browserUtils } from '../../utils/browser.util';
import { commonUtils } from '../../utils/common.util';
import { storageHelper } from '../storageHelper';

const context = (function () {
  const cfilter = { urls: [], properties: ['status'] };

  function initModule(module) {}

  async function load() {
    const modules = await storageHelper.getModules();
    for (const module in modules) {
      loadModule(modules[module]);
    }
  }

  async function unload() {
    if (browser.tabs.onUpdated.hasListener(registerContextScripts))
      browser.tabs.onUpdated.removeListener(registerContextScripts);
  }

  function loadModule(module) {
    if (module.is_enabled) {
      if (module.functions.includes('context')) {
        for (const item of module.contex.context_matches) {
          cfilter.urls.push(item);
        }
        if (browser.tabs.onUpdated.hasListener(registerContextScripts))
          browser.tabs.onUpdated.removeListener(registerContextScripts);
        if (cfilter.urls.length > 0)
          browser.tabs.onUpdated.addListener(registerContextScripts);
      }
    }
  }

  function unloadModule(module) {
    function arrayRemove(arr, value) {
      return arr.filter(function (ele) {
        return ele != value;
      });
    }
    if (module.functions.includes('context')) {
      for (const item of module.contex.context_matches) {
        cfilter.urls = arrayRemove(cfilter.urls, item);
      }
      if (browser.tabs.onUpdated.hasListener(registerContextScripts))
        browser.tabs.onUpdated.removeListener(registerContextScripts);
      if (cfilter.urls.length > 0)
        browser.tabs.onUpdated.addListener(registerContextScripts);
    }
  }

  function registerContextScripts(tabId, changeInfo, tabInfo) {
    let injectScript = false;
    for (const filter of cfilter.urls) {
      if (commonUtils.wildcard(tabInfo.url, filter)) {
        injectScript = true;
        break;
      }
    }

    if (!injectScript) return;
    if (changeInfo.status == 'loading')
      browserUtils
        .injectScript(tabId, [
          '/lib/browser-polyfill.js',
          '/core/content_scripts/context_script.js',
        ])
        .catch((err) => {
          console.error(err);
        });
  }

  async function injectAttrCollectors(url) {
    const modules = await storageHelper.getModules();
    for (const module in modules) {
      if (modules[module].functions.includes('context')) {
        if (modules[module].is_enabled)
          for (const item of modules[module].contex.context_matches) {
            if (commonUtils.wildcard(url, item)) {
              const context = modules[module].context.items.filter(function (
                cnt,
                index,
                arr,
              ) {
                return cnt.is_enabled && cnt.type == 'content';
              });
              return { moduleName: modules[module].name, context: context };
            }
          }
      }
    }
    return;
  }
  return {
    initModule,
    load,
    unload,
    loadModule,
    unloadModule,
    injectAttrCollectors,
  };
})();
export { context };
