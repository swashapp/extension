// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import browser from 'webextension-polyfill';

import { commonUtils } from '../../utils/common.util';
import { dataHandler } from '../dataHandler';
import { storageHelper } from '../storageHelper';

const ajax = (function () {
  let activeModules = [];

  let callbacks = {};
  let enabledCallbacks = {};
  let enabledTabs = {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function initModule() {}

  async function load() {
    const modules = await storageHelper.getModules();
    for (const module in modules) {
      loadModule(modules[module]);
    }
  }

  async function unload() {
    const modules = await storageHelper.getModules();
    for (const module in modules) {
      unloadModule(modules[module]);
    }

    activeModules = [];
    callbacks = {};
    enabledCallbacks = {};
    enabledTabs = {};
  }

  function loadModule(module) {
    if (module.is_enabled) {
      if (module.functions.includes('ajax')) {
        module.ajax.items.forEach((data) => {
          if (data.is_enabled) {
            activeModules.push(module);
            load_collector(module, data);
          }
        });
        if (!browser.tabs.onUpdated.hasListener(registerAjaxScript))
          browser.tabs.onUpdated.addListener(registerAjaxScript);
      }
    }
  }

  function unloadModule(module) {
    if (module.functions.includes('ajax')) {
      module.ajax.items.forEach((data) => {
        if (callbacks[module.name + '_' + data.name]) {
          unload_collector(module, data);
        }
      });
      if (browser.tabs.onUpdated.hasListener(registerAjaxScript))
        browser.tabs.onUpdated.removeListener(registerAjaxScript);
    }
  }

  function load_collector(module, data) {
    switch (data.hook) {
      case 'webRequest':
        hook_webrequest(module, data);
        break;
    }
  }

  function unload_collector(module, data) {
    const name = module.name + '_' + data.name;

    switch (data.hook) {
      case 'webRequest':
        if (browser.webRequest.onCompleted.hasListener(callbacks[name])) {
          browser.webRequest.onCompleted.removeListener(callbacks[name]);
        }
        break;
    }
  }

  async function hook_webrequest(module, data) {
    const name = module.name + '_' + data.name;

    callbacks[name] = async function (details) {
      if (!enabledCallbacks[details.tabId]) {
        return;
      }
      if (!enabledTabs[details.tabId]) {
        return;
      }

      const {
        documentId,
        documentLifecycle,
        frameId,
        frameType,
        fromCache,
        initiator,
        method,
        parentDocumentId,
        parentFrameId,
        requestId,
        statusCode,
        statusLine,
        tabId,
        timeStamp,
        type,
        url,
      } = details;

      dataHandler.handle(
        {
          origin: details.url,
          header: {
            function: 'ajax',
            module: module.name,
            collector: data.name,
          },
          data: {
            out: {
              documentId,
              documentLifecycle,
              frameId,
              frameType,
              fromCache,
              initiator,
              method,
              parentDocumentId,
              parentFrameId,
              requestId,
              statusCode,
              statusLine,
              tabId,
              timeStamp,
              type,
              url,
            },
            schems: [
              { jpath: '$.documentId', type: 'id' },
              { jpath: '$.documentLifecycle', type: 'text' },
              { jpath: '$.frameId', type: 'id' },
              { jpath: '$.frameType', type: 'text' },
              { jpath: '$.fromCache', type: 'text' },
              { jpath: '$.initiator', type: 'url' },
              { jpath: '$.method', type: 'text' },
              { jpath: '$.parentDocumentId', type: 'id' },
              { jpath: '$.parentFrameId', type: 'id' },
              { jpath: '$.requestId', type: 'id' },
              { jpath: '$.statusCode', type: 'text' },
              { jpath: '$.statusLine', type: 'text' },
              { jpath: '$.tabId', type: 'id' },
              { jpath: '$.timeStamp', type: 'date' },
              { jpath: '$.type', type: 'text' },
              { jpath: '$.url', type: 'url' },
            ],
          },
        },
        details.tabId,
      );
    };

    if (!browser.webRequest.onCompleted.hasListener(callbacks[name])) {
      const filter = data.filter ? data.filter : module.ajax.ajax_filter;

      const extraInfoSpec = data.extraInfoSpec
        ? data.extraInfoSpec
        : module.ajax.ajax_extraInfoSpec;

      browser.webRequest.onCompleted.addListener(
        callbacks[name],
        filter,
        extraInfoSpec,
      );

      const updateTabsStatus = function (id: number, url?: string): void {
        if (url) {
          enabledTabs[id] = false;

          for (const item of module.ajax.url_matches) {
            if (commonUtils.wildcard(url, item)) {
              enabledTabs[id] = true;
              break;
            }
          }
        }
      };

      browser.tabs.onCreated.addListener(function (tab) {
        enabledCallbacks[tab.id] = false;
        updateTabsStatus(tab.id, tab.url);
      });

      browser.tabs.onRemoved.addListener(function (tabId) {
        delete enabledCallbacks[tabId];
        delete enabledTabs[tabId];
      });

      browser.tabs.onUpdated.addListener(function (tabId, changeInfo) {
        updateTabsStatus(tabId, changeInfo.url);
      });
    }
  }

  async function registerAjaxScript(tabId, changeInfo) {
    if (changeInfo.status == 'loading') {
      browser.scripting
        .executeScript({
          injectImmediately: true,
          target: { tabId, allFrames: false },
          files: [
            '/lib/browser-polyfill.js',
            '/core/content_scripts/ajax_script.js',
          ],
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  async function getConfigs(url: string) {
    const messages = [];
    for (const module of activeModules) {
      for (const item of module.ajax.url_matches) {
        if (commonUtils.wildcard(url, item)) {
          messages.push({
            name: module.name,
            items: module.ajax.items,
          });
          break;
        }
      }
    }
    return messages;
  }

  async function startTimer(time) {
    const queryOptions = { active: true, lastFocusedWindow: true };
    const [tab] = await chrome.tabs.query(queryOptions);

    enabledCallbacks[tab.id] = true;
    setTimeout(() => {
      enabledCallbacks[tab.id] = false;
    }, time);
  }

  return {
    initModule,
    load,
    unload,
    getConfigs,
    startTimer,
  };
})();
export { ajax };
