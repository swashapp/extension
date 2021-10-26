// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import browser from 'webextension-polyfill';

import { browserUtils } from '../../utils/browser.util';
import { commonUtils } from '../../utils/common.util';
import { storageHelper } from '../storageHelper';

const content = (function () {
  'use strict';

  const cfilter = { urls: [], properties: ['status'] };

  async function initModule(module) {
    if (module.functions.includes('content')) {
      const info = await browserUtils.getPlatformInfo();
      let platform = module.content.content_mapping[info.os];
      if (!platform || typeof platform === 'undefined') platform = 'desktop';
      module.content.items = module.content[platform];
    }
  }

  function unload() {
    if (browser.tabs.onUpdated.hasListener(registerContentScripts))
      browser.tabs.onUpdated.removeListener(registerContentScripts);
  }

  function load() {
    storageHelper.getModules().then((modules) => {
      for (const module in modules) {
        loadModule(modules[module]);
      }
    });
  }

  function unloadModule(module) {
    function arrayRemove(arr, value) {
      return arr.filter(function (ele) {
        return ele != value;
      });
    }
    if (module.functions.includes('content')) {
      for (const item of module.content.content_matches) {
        cfilter.urls = arrayRemove(cfilter.urls, item);
      }
      if (browser.tabs.onUpdated.hasListener(registerContentScripts))
        browser.tabs.onUpdated.removeListener(registerContentScripts);
      if (cfilter.urls.length > 0)
        browser.tabs.onUpdated.addListener(registerContentScripts);
    }
  }

  function loadModule(module) {
    if (module.is_enabled) {
      if (module.functions.includes('content')) {
        for (const item of module.content.content_matches) {
          cfilter.urls.push(item);
        }
        if (browser.tabs.onUpdated.hasListener(registerContentScripts))
          browser.tabs.onUpdated.removeListener(registerContentScripts);
        if (cfilter.urls.length > 0)
          browser.tabs.onUpdated.addListener(registerContentScripts);
      }
    }
  }

  function registerContentScripts(tabId, changeInfo, tabInfo) {
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
          browser.tabs.executeScript(tabId, {
            file: '/core/content_scripts/content_script.js',
            allFrames: false,
            runAt: 'document_start',
          });
        })
        .catch((err) => {
          console.error('err');
          console.error(err);
        });
    }
  }

  async function injectCollectors(url) {
    const modules = await storageHelper.getModules();
    const messages = [];
    for (const module in modules) {
      if (modules[module].functions.includes('content')) {
        if (modules[module].is_enabled)
          for (const item of modules[module].content.content_matches) {
            if (commonUtils.wildcard(url, item)) {
              const content = modules[module].content.items.filter(function (
                cnt,
                index,
                arr,
              ) {
                return (
                  cnt.is_enabled && commonUtils.wildcard(url, cnt.url_match)
                );
              });
              messages.push({
                moduleName: modules[module].name,
                content: content,
              });
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
    unloadModule,
    loadModule,
    injectCollectors,
  };
})();
export { content };
