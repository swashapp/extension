import browser from 'webextension-polyfill';

import { BackupEntity } from '../entities/backup.entity';
import { ConfigEntity } from '../entities/config.entity';
import { FilterEntity } from '../entities/filter.entity';
import { ModuleEntity } from '../entities/module.entity';
import { ProfileEntity } from '../entities/profile.entity';
import { Any } from '../types/any.type';
import { Module } from '../types/storage/module.type';

import { commonUtils } from '../utils/common.util';

import { adsHelper } from './adsHelper';
import { charityHelper } from './charityHelper';
import { configManager } from './configManager';
import { databaseHelper } from './databaseHelper';
import { dataHandler } from './dataHandler';
import { functions, persistentFunctions } from './functions';
import { apiCall } from './functions/apiCall';
import { graphApiHelper } from './graphApiHelper';
import { memberManager } from './memberManager';
import { newTabHelper } from './newTabHelper';
import { onboarding } from './onboarding';
import { pageAction } from './pageAction';
import { storageHelper } from './storageHelper';
import { swashApiHelper } from './swashApiHelper';
import { userHelper } from './userHelper';

const loader = (function () {
  let dbHelperInterval: NodeJS.Timer;
  let intervalId: NodeJS.Timer;

  async function install() {
    try {
      const backup = await BackupEntity.getInstance();
      const old_db = await storageHelper.getAll();

      const old_version = old_db.configs.version;
      const new_version = browser.runtime.getManifest().version;

      if (old_version === new_version) return;
      console.log(`Updating Swash from v${old_version} to v${new_version}`);

      // Backup old database
      delete old_db._backup;
      await backup.save(JSON.stringify(old_db));

      // Updating filters
      console.log(`Updating configs`);
      const configs = await ConfigEntity.getInstance();
      await configs.upgrade();

      const profile = await ProfileEntity.getInstance();
      if (old_db.configs.version <= '1.0.8' && old_db.configs.encryptedWallet) {
        console.log(`Moving private key from configs to profile`);
        await profile.update('encryptedWallet', old_db.configs.encryptedWallet);
      }
      console.log(`Updating profile`);
      await profile.upgrade();

      // Updating filters
      console.log(`Updating exclude urls`);
      const filters = await FilterEntity.getInstance();
      await filters.upgrade();

      // Updating modules
      console.log(`Updating modules`);
      const modules = await ModuleEntity.getInstance();
      await modules.upgrade();

      // Updating all
      console.log(`Updating all`);
      await onUpdatedAll();

      await userHelper.loadSavedWallet();
    } catch (err) {
      console.error(err);
    }
  }

  async function onInstalled() {
    await reload();
    updateSchedule().catch(console.error);
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

  async function loadNotifications() {
    const states = await storageHelper.getStates();
    console.log('Loading notifications');

    if (commonUtils.isToday(new Date(states.lastNotificationUpdate))) {
      console.log('No need to load notifications today');
      return;
    }

    const serverNotifications = await swashApiHelper.getNotifications();

    if (serverNotifications.length > 0) {
      const notifications: {
        [key: string]: {
          type: string;
          title: string;
          text: string;
          link: string;
        };
      } = {};

      serverNotifications.forEach((item) => {
        if (!notifications[item.type]) notifications[item.type] = item;
      });

      const localNotifications = await storageHelper.getNotifications();
      storageHelper
        .saveNotifications({
          ...localNotifications,
          ...notifications,
        })
        .catch(console.error);
    }

    states.lastNotificationUpdate = Date.now();
    await storageHelper.saveStates(states);
  }

  async function loadFunctions() {
    console.log('Loading functions');
    for (const func of functions) {
      await func.load();
    }
  }

  async function unloadFunctions() {
    console.log('Unloading functions');
    for (const func of functions) {
      await func.unload();
    }
  }

  async function loadPersistentFunctions() {
    console.log('Loading persistent functions');
    for (const func of persistentFunctions) {
      await func.load();
    }
  }

  async function unloadPersistentFunctions() {
    console.log('Unloading persistent functions');
    for (const func of persistentFunctions) {
      await func.unload();
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

  async function start() {
    console.log('Trying to start extension');
    await storageHelper.updateConfigs('is_enabled', true);
    init(true);
    await loadFunctions();
    loadNotifications();
    console.log('Extension started successfully');
  }

  async function stop() {
    console.log('Trying to stop extension');
    await storageHelper.updateConfigs('is_enabled', false);
    init(false);
    await unloadFunctions();
    console.log('Extension stopped successfully');
  }

  function databaseInterval() {
    databaseHelper.init().then(() => {
      dataHandler.sendDelayedMessages().then();
    });
  }

  async function load() {
    console.log('Loading the extension configuration');
    const db = await storageHelper.getAll();
    dbHelperInterval = setInterval(databaseInterval, 10000);
    await userHelper.loadSavedWallet();
    if (db.configs.is_enabled) {
      init(true);
      await loadFunctions();
      memberManager.tryJoin().catch(console.error);
    } else {
      init(false);
      await unloadFunctions();
    }
    await loadPersistentFunctions();
    loadNotifications();
  }

  async function reload() {
    console.log('Reloading the extension configuration');
    const db = await storageHelper.getAll();
    clearInterval(dbHelperInterval);
    dbHelperInterval = setInterval(databaseInterval, 10000);
    init(false);
    await userHelper.loadSavedWallet();
    await unloadFunctions();
    await unloadPersistentFunctions();
    if (db.configs.is_enabled) {
      init(true);
      await loadFunctions();
      memberManager.tryJoin().catch(console.error);
    }
    await loadPersistentFunctions();
    loadNotifications();
  }

  function configModule(moduleName: string, settings: Any) {
    console.log('Configuring extension modules');
    return storageHelper.saveModuleSettings(moduleName, settings).then(() => {
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
    await storageHelper.saveModules(dbModules);
  }

  async function initiateConfigs() {
    await storageHelper.getStates();

    await memberManager.init();
    await dataHandler.init();
    await userHelper.init();
    await onboarding.init();
    await apiCall.init();
    await swashApiHelper.init();
    await graphApiHelper.init();
    await charityHelper.init();
    await adsHelper.init();
    await newTabHelper.init();
  }

  async function onUpdatedAll() {
    console.log('Loading updated configs');
    await initiateConfigs();

    console.log('Loading updated modules');
    await onModulesUpdated();
  }

  async function updateSchedule() {
    async function update() {
      const states = await storageHelper.getStates();
      const lastUpdateCheck = new Date(states.lastConfigUpdate);
      console.log(`Last update check is ${lastUpdateCheck}`);

      if (commonUtils.isToday(lastUpdateCheck)) {
        console.log(`No need to update configuration files today`);
        return;
      }

      await configManager.updateAll();
      await onUpdatedAll();

      states.lastConfigUpdate = Date.now();
      await storageHelper.saveStates(states);
    }

    const configs = await storageHelper.getConfigs();
    if (intervalId) clearInterval(intervalId);
    await update();
    if (configs.manifest)
      intervalId = setInterval(update, configs.manifest.updateInterval);
  }

  return {
    install,
    onInstalled,
    start,
    stop,
    load,
    reload,
    configModule,
    initiateConfigs,
  };
})();
export { loader };
