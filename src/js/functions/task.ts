// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import browser from 'webextension-polyfill';

import { dataHandler } from '../dataHandler';
import { storageHelper } from '../storageHelper';
import { utils } from '../utils';

const task = (function () {
  'use strict';

  const cfilter = { urls: [], properties: ['status'] };

  function initModule(module) {}

  function unload() {
    if (browser.tabs.onUpdated.hasListener(registerTaskScripts))
      browser.tabs.onUpdated.removeListener(registerTaskScripts);
  }

  function load() {
    storageHelper.retrieveModules().then((modules) => {
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
    if (module.functions.includes('task')) {
      for (const item of module.task.task_matches) {
        cfilter.urls = arrayRemove(cfilter.urls, item);
      }
      if (browser.tabs.onUpdated.hasListener(registerTaskScripts))
        browser.tabs.onUpdated.removeListener(registerTaskScripts);
      if (cfilter.urls.length > 0)
        browser.tabs.onUpdated.addListener(registerTaskScripts);
    }
  }

  function loadModule(module) {
    if (module.is_enabled) {
      if (module.functions.includes('task')) {
        for (const item of module.task.task_matches) {
          cfilter.urls.push(item);
        }
        if (browser.tabs.onUpdated.hasListener(registerTaskScripts))
          browser.tabs.onUpdated.removeListener(registerTaskScripts);
        if (cfilter.urls.length > 0)
          browser.tabs.onUpdated.addListener(registerTaskScripts);
      }
    }
  }

  function registerTaskScripts(tabId, changeInfo, tabInfo) {
    let injectScript = false;
    for (const filter of cfilter.urls) {
      if (utils.wildcard(tabInfo.url, filter)) {
        injectScript = true;
        break;
      }
    }

    if (changeInfo.status == 'loading')
      browser.tabs
        .executeScript(tabId, {
          file: '/lib/browser-polyfill.js',
          allFrames: false,
          runAt: 'document_start',
        })
        .then((result) => {
          browser.tabs.executeScript(tabId, {
            file: '/js/content_scripts/task_script.js',
            allFrames: false,
            runAt: 'document_end',
          });
        });
  }

  function createTask(info) {
    info.startTime = Date();
    storageHelper.createTask(info);
  }

  async function sendTaskResult(info) {
    const task = await storageHelper.endTask(info);
    task.endTime = Date();
    task.success = info.success;
    dataHandler.handle({
      origin: info.url,
      header: {
        function: 'task',
        module: info.moduleName,
        collector: info.name,
      },
      data: {
        out: {
          task: task,
        },
        schems: [{ jpath: '$.task', type: 'text' }],
      },
    });
  }

  function manageTask(info) {
    if (!info.created) {
      createTask(info);
    } else {
      sendTaskResult(info);
    }
  }

  async function injectTasks(url) {
    const modules = await storageHelper.retrieveModules();
    for (const module in modules) {
      if (modules[module].functions.includes('task')) {
        if (modules[module].is_enabled)
          for (const item of modules[module].task.task_matches) {
            if (utils.wildcard(url, item)) {
              const tasks = modules[module].task.items.filter(function (
                cnt,
                index,
                arr,
              ) {
                return cnt.is_enabled;
              });
              const startedTasks = await storageHelper.loadAllModuleTaskIds(
                modules[module].name,
              );
              return {
                moduleName: modules[module].name,
                tasks: tasks,
                startedTasks: startedTasks,
              };
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
    unloadModule,
    loadModule,
    injectTasks: injectTasks,
    manageTask: manageTask,
  };
})();
export { task };
