import browser from 'webextension-polyfill';

import { Any } from '../types/any.type';
import { Filter } from '../types/storage/filter.type';
import { Module } from '../types/storage/module.type';
import { commonUtils } from '../utils/common.util';

import { configManager } from './configManager';
import { databaseHelper } from './databaseHelper';
import { dataHandler } from './dataHandler';
import { functions } from './functions';
import { apiCall } from './functions/apiCall';
import { internalFilters } from './internalFilters';
import { ssConfig } from './manifest';
import { memberManager } from './memberManager';
import { onboarding } from './onboarding';
import { pageAction } from './pageAction';
import { storageHelper } from './storageHelper';
import { swashApiHelper } from './swashApiHelper';
import { userHelper } from './userHelper';

const loader = (function () {
  let dbHelperInterval: NodeJS.Timer;
  let intervalId: NodeJS.Timer;

  async function createDBIfNotExist() {
    const configs = await storageHelper.getConfigs();
    if (!configs.Id || !configs.salt) {
      configs.Id = commonUtils.uuid();
      configs.salt = commonUtils.uuid();
      return storageHelper.saveConfigs(configs);
    }
  }

  async function install() {
    try {
      await createDBIfNotExist();
      const db = await storageHelper.getAll();

      //backup old database
      delete db._backup;
      db._backup = JSON.stringify(db);

      //onboarding added from version 1.0.8
      if (!db.onboarding) db.onboarding = {};
      //from version 1.0.9 move wallet to profile object for safety
      console.log(
        `Update Swash from version ${db.configs.version} to ${ssConfig.version}`,
      );
      if (db.configs.version <= '1.0.8' && db.configs.encryptedWallet) {
        console.log(`moving private key from configs to profile`);
        db.profile.encryptedWallet = db.configs.encryptedWallet;
      }

      db.configs.version = ssConfig.version;

      //keeping defined filters and updating internal filters
      console.log(`Updating exclude urls`);
      const userFilters = db.filters.filter((filter: Filter) => {
        return !filter.internal;
      });
      for (const f of internalFilters) {
        userFilters.push(f);
      }
      db.filters = userFilters;

      //updating modules
      console.log(`Updating modules`);
      db.modules = await onModulesUpdated();

      //updating configurations
      // commonUtils.jsonUpdate(db.configs, configs);
      return storageHelper.saveAll(db);
    } catch (exp) {
      console.error(exp);
    }
  }

  async function onInstalled() {
    await reload();
    memberManager.tryJoin();
    updateSchedule().then();
  }

  function changeIconOnUpdated(tabId: number, changeInfo: Any, tabInfo: Any) {
    if (!changeInfo.url || !tabInfo.active) return;
    pageAction.loadIcons(tabInfo.url);
  }

  function changeIconOnActivated(activeInfo: Any) {
    browser.tabs.get(activeInfo.tabId).then((tabInfo) => {
      if (tabInfo.url) {
        pageAction.loadIcons(tabInfo.url);
      }
    });
  }

  function init(isEnabled: boolean) {
    if (isEnabled) {
      if (!browser.tabs.onUpdated.hasListener(changeIconOnUpdated))
        browser.tabs.onUpdated.addListener(changeIconOnUpdated);
      if (!browser.tabs.onActivated.hasListener(changeIconOnActivated))
        browser.tabs.onActivated.addListener(changeIconOnActivated);
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then((activeTab) => {
          if (activeTab.length > 0) pageAction.loadIcons(activeTab[0].url);
        });
    } else {
      if (browser.tabs.onUpdated.hasListener(changeIconOnUpdated))
        browser.tabs.onUpdated.removeListener(changeIconOnUpdated);
      if (browser.tabs.onActivated.hasListener(changeIconOnActivated))
        browser.tabs.onActivated.removeListener(changeIconOnActivated);
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then((activeTab) => {
          if (activeTab.length > 0) pageAction.loadIcons(activeTab[0].url);
        });
    }
  }

  function loadNotifications() {
    console.log('Loading notifications');
    swashApiHelper.getNotifications().then((res) => {
      if (res.length > 0) {
        const notifications: {
          [key: string]: {
            type: string;
            title: string;
            text: string;
            link: string;
          };
        } = {};
        res.forEach((item) => {
          if (!notifications[item.type]) notifications[item.type] = item;
        });
        storageHelper.getNotifications().then((_notifications) => {
          storageHelper.saveNotifications({
            ..._notifications,
            ...notifications,
          });
        });
      }
    });
  }

  function loadFunctions() {
    console.log('Loading functions');
    for (const func of functions) {
      func.load();
    }
  }

  function unloadFunctions() {
    console.log('Unloading functions');
    for (const func of functions) {
      func.unload();
    }
  }

  function functionsLoadModule(module: Module) {
    console.log('Loading functions module');
    for (const func of functions) {
      func.loadModule(module);
    }
  }

  function functionsUnLoadModule(module: Module) {
    console.log('Unloading functions module');
    for (const func of functions) {
      func.unloadModule(module);
    }
  }

  function start() {
    console.log('Trying to start extension');
    storageHelper.updateConfigs('is_enabled', true).then(() => {
      init(true);
      loadFunctions();
      loadNotifications();
      console.log('Extension started successfully');
    });
  }

  function stop() {
    console.log('Trying to stop extension');
    storageHelper.updateConfigs('is_enabled', false).then(() => {
      init(false);
      unloadFunctions();
      console.log('Extension stopped successfully');
    });
  }

  function restart() {
    stop();
    start();
  }

  async function load() {
    console.log('Loading the extension configuration');
    storageHelper.getAll().then(async (db) => {
      dbHelperInterval = setInterval(async function () {
        await databaseHelper.init();
        await dataHandler.sendDelayedMessages();
      }, 10000);
      await userHelper.loadEncryptedWallet(
        db.profile.encryptedWallet,
        db.configs.salt,
      );
      if (db.configs.is_enabled) {
        init(true);
        loadFunctions();
        loadNotifications();
      } else {
        init(false);
        unloadFunctions();
      }
    });
  }

  async function reload() {
    console.log('Reloading the extension configuration');
    storageHelper.getAll().then(async (db) => {
      clearInterval(dbHelperInterval);
      dbHelperInterval = setInterval(async function () {
        await databaseHelper.init();
        await dataHandler.sendDelayedMessages();
      }, 10000);
      init(false);
      await userHelper.loadEncryptedWallet(
        db.profile.encryptedWallet,
        db.configs.salt,
      );
      unloadFunctions();
      if (db.configs.is_enabled) {
        init(true);
        loadFunctions();
        loadNotifications();
      }
    });
  }

  function configModule(moduleName: string, settings: Any) {
    console.log('Configuring extension modules');
    return storageHelper.saveModuleSettings(moduleName, settings).then((x) => {
      storageHelper.getAll().then((db) => {
        const module = db.modules[moduleName];
        functionsUnLoadModule(module);
        if (db.configs.is_enabled) functionsLoadModule(module);
      });
    });
  }

  async function onModulesUpdated() {
    const modules = await storageHelper.getModules();
    const dbModules: { [key: string]: Module } = {};
    for (const [, module] of Object.entries(modules)) {
      for (const func of functions) {
        await func.initModule(module);
      }
      dbModules[module.name] = module;
    }
    return dbModules;
  }

  async function onConfigsUpdated() {
    await memberManager.init();
    await dataHandler.init();
    await userHelper.init();
    await onboarding.init();
    await apiCall.init();
    await swashApiHelper.init();
  }

  async function onUpdatedAll() {
    console.log('Loading updated configs');
    await onConfigsUpdated();

    console.log('Loading updated modules');
    await onModulesUpdated();
  }

  async function updateSchedule() {
    async function update() {
      await configManager.updateAll();
      await onUpdatedAll();
    }

    const configs = await storageHelper.getConfigs();
    if (intervalId) clearInterval(intervalId);
    await update();
    if (configs.manifest)
      intervalId = setInterval(update, configs.manifest.updateInterval);
  }

  return {
    createDBIfNotExist,
    install,
    onInstalled,
    start,
    stop,
    load,
    reload,
    restart,
    configModule,
  };
})();
export { loader };
