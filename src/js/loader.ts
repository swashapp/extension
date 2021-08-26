import browser from 'webextension-polyfill';

import { Tabs } from 'webextension-polyfill/namespaces/tabs';

import { Any } from '../types/any.type';
import { Config } from '../types/config/config.type';
import { Filter } from '../types/filter.type';
import { Module } from '../types/module.type';

import { communityHelper } from './communityHelper';
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
import { utils } from './utils';

import Tab = Tabs.Tab;
import OnActivatedActiveInfoType = Tabs.OnActivatedActiveInfoType;
import OnUpdatedChangeInfoType = Tabs.OnUpdatedChangeInfoType;

const loader = (function () {
  'use strict';
  let configs: Config;
  let modules: { [key: string]: Module };
  let dbHelperInterval: NodeJS.Timer;
  let intervalId: NodeJS.Timer;

  function initConfs() {
    configs = configManager.getAllConfigs();
    modules = configManager.getAllModules();
  }

  async function isDBCreated(db: Any) {
    return !(db == null || Object.keys(db).length === 0);
  }

  async function createDBIfNotExist() {
    let db = await storageHelper.retrieveAll();
    if (!(await isDBCreated(db))) {
      console.log('Creating new DB');
      db = {
        modules: {},
        configs: {},
        profile: {},
        filters: [],
        privacyData: [],
        onboarding: {},
      };
      db.configs.Id = utils.uuid();
      db.configs.salt = utils.uuid();
      db.configs.delay = 2;
      utils.jsonUpdate(db.configs, ssConfig);
      return storageHelper.storeAll(db);
    }
  }

  async function install() {
    try {
      await createDBIfNotExist();
      const db = await storageHelper.retrieveAll();

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
      console.log(`Updating exculde urls`);
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
      utils.jsonUpdate(db.configs, configs);
      return storageHelper.storeAll(db);
    } catch (exp) {
      console.error(exp);
    }
  }

  async function onInstalled() {
    await reload();
    memberManager.tryJoin();
    updateSchedule().then();
  }

  function changeIconOnUpdated(
    tabId: number,
    changeInfo: OnUpdatedChangeInfoType,
    tabInfo: Tab,
  ) {
    if (!changeInfo.url || !tabInfo.active) return;
    pageAction.loadIcons(tabInfo.url);
  }

  function changeIconOnActivated(activeInfo: OnActivatedActiveInfoType) {
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

  function loadFunctions() {
    for (const func of functions) {
      func.load();
    }
  }

  function unloadFunctions() {
    for (const func of functions) {
      func.unload();
    }
  }

  function functionsLoadModule(module: Module) {
    for (const func of functions) {
      func.loadModule(module);
    }
  }

  function functionsUnLoadModule(module: Module) {
    for (const func of functions) {
      func.unloadModule(module);
    }
  }

  function start() {
    const config = { is_enabled: true };
    storageHelper.updateConfigs(config).then(() => {
      init(true);
      loadFunctions();
    });
  }

  function stop() {
    const config = { is_enabled: false };
    storageHelper.updateConfigs(config).then(() => {
      init(false);
      unloadFunctions();
    });
  }

  function restart() {
    stop();
    start();
  }

  async function load() {
    storageHelper.retrieveAll().then(async (db) => {
      dbHelperInterval = setInterval(async function () {
        await databaseHelper.init();
        await dataHandler.sendDelayedMessages();
      }, 10000);
      await communityHelper.loadWallet(
        db.profile.encryptedWallet,
        db.configs.salt,
      );
      if (db.configs.is_enabled) {
        init(true);
        loadFunctions();
      } else {
        init(false);
        unloadFunctions();
      }
    });
  }

  async function reload() {
    storageHelper.retrieveAll().then(async (db) => {
      clearInterval(dbHelperInterval);
      dbHelperInterval = setInterval(async function () {
        await databaseHelper.init();
        await dataHandler.sendDelayedMessages();
      }, 10000);
      init(false);
      const x = await communityHelper.loadWallet(
        db.profile.encryptedWallet,
        db.configs.salt,
      );
      unloadFunctions();
      if (db.configs.is_enabled) {
        init(true);
        loadFunctions();
      }
    });
  }

  function configModule(moduleName: string, settings: Any) {
    return storageHelper.saveModuleSettings(moduleName, settings).then((x) => {
      storageHelper.retrieveAll().then((db) => {
        const module = db.modules[moduleName];
        functionsUnLoadModule(module);
        if (db.configs.is_enabled) functionsLoadModule(module);
      });
    });
  }

  async function onModulesUpdated() {
    const dbModules: { [key: string]: Module } = {};
    for (const moduleName in modules) {
      const module = modules[moduleName];
      for (const func of functions) {
        await func.initModule(module);
      }
      dbModules[module.name] = module;
    }
    return dbModules;
  }

  function onConfigsUpdated() {
    memberManager.init();
    dataHandler.init();
    communityHelper.init();
    onboarding.init();
    apiCall.init();
    swashApiHelper.init();
    initConfs();
  }

  async function onUpdatedAll() {
    console.log('Storing updated configs');
    onConfigsUpdated();
    await storageHelper.updateData('configs', configs);

    console.log('Storing updated modules');
    const dbModules = await onModulesUpdated();
    await storageHelper.storeData('modules', dbModules);
  }

  async function updateSchedule() {
    async function update() {
      await configManager.updateAll();
      await onUpdatedAll();
    }
    if (intervalId) clearInterval(intervalId);
    await update();
    if (configs.manifest)
      intervalId = setInterval(update, configs.manifest.updateInterval);
  }

  return {
    initConfs,
    isDBCreated,
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
