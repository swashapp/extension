import browser from 'webextension-polyfill';

import { Any } from '../types/any.type';
import { Config } from '../types/config/config.type';
import { Onboarding } from '../types/config/onboarding.type';
import { Filter } from '../types/filter.type';
import { Message } from '../types/message.type';
import { Module } from '../types/module.type';
import { Profile } from '../types/profile.type';

import { utils } from './utils';

const storageHelper = (function () {
  const messages: { [key: string]: Message } = {};
  const functionList = ['content', 'browsing', 'apiCall', 'context', 'task'];

  function retrieveProfile() {
    return retrieveData('profile');
  }

  function updateProfile(info: Profile) {
    return updateData('profile', info);
  }

  function retrieveFilters() {
    return retrieveData('filters');
  }

  function retrieveConfigs() {
    return retrieveData('configs');
  }

  function updateConfigs(info: Config) {
    return updateData('configs', info);
  }

  function storeFilters(filters: Filter[]) {
    return updateData('filters', filters);
  }

  function retrieveModules() {
    return retrieveData('modules');
  }

  function updateModules(info: { [key: string]: Module }) {
    return updateData('modules', info);
  }

  async function removeModule(moduleName: string) {
    const info = await retrieveData('modules');
    delete info[moduleName];
    browser.storage.local.set({ modules: info }).then();
  }

  function saveMessage(msg: Message, id: number) {
    messages[id] = msg;
  }

  function removeMessage(id: number) {
    /*
        var info = await retrieveData("messages");
        delete info[id];
        browser.storage.local.set({messages:info});*/
    delete messages[id];
  }

  function retrieveMessages() {
    return messages;
  }

  async function storeAll(db: Any) {
    await browser.storage.local.set(db);
  }

  function retrieveAll() {
    return browser.storage.local.get();
  }

  async function updateData(key: string, info: Any) {
    const data = await retrieveData(key);
    utils.jsonUpdate(data, info);
    const x: { [key: string]: Any } = {};
    x[key] = data;
    return browser.storage.local.set(x);
  }

  async function storeData(key: string, info: Any) {
    const x: { [key: string]: Any } = {};
    x[key] = info;
    return browser.storage.local.set(x);
  }

  async function retrieveData(key: string) {
    const x = await browser.storage.local.get(key);
    return x[key];
  }

  async function createTask(info: Any) {
    const tasks = await retrieveData('tasks');
    if (!tasks[info.moduleName]) tasks[info.moduleName] = {};
    tasks[info.moduleName][info.name] = {
      startTime: info.startTime,
      taskId: info.taskId,
      endTime: -1,
      success: 'unknown',
    };
    const x: { [key: string]: Any } = {};
    x['tasks'] = tasks;
    browser.storage.local.set(x).then();
  }

  async function endTask(info: Any) {
    const tasks = await retrieveData('tasks');
    if (!info || !tasks[info.moduleName] || !tasks[info.moduleName][info.name])
      return;
    const res = Object.assign({}, tasks[info.moduleName][info.name]);
    delete tasks[info.moduleName][info.name];

    const x: { [key: string]: Any } = {};
    x['tasks'] = tasks;
    browser.storage.local.set(x).then();
    return res;
  }

  async function loadAllModuleTaskIds(moduleName: string) {
    const tasks = await retrieveData('tasks');
    return tasks[moduleName];
  }

  function updateFunctionSettings(
    module: Module,
    functionName: string,
    settings: Any,
  ) {
    if (module.functions.includes(functionName)) {
      for (const item of module[functionName].items) {
        item.is_enabled = settings[functionName][item.name];
      }
    }
  }

  function updatePrivacyLevel(privacyLevel: Any) {
    const key = 'configs';
    const info = { privacyLevel: privacyLevel };
    return updateData(key, info);
  }

  async function saveModuleSettings(moduleName: string, settings: Any) {
    const modules = await retrieveData('modules');
    const ret = modules[moduleName];
    if (typeof settings.is_enabled != 'undefined')
      ret.is_enabled = settings.is_enabled;
    for (const f of functionList) {
      if (typeof settings[f] != 'undefined')
        updateFunctionSettings(ret, f, settings);
    }
    return browser.storage.local.set({ modules: modules });
  }

  async function getVersion() {
    const configs = await retrieveData('configs');
    return configs.version;
  }

  function retrieveOnboarding() {
    return retrieveData('onboarding');
  }

  function updateOnboarding(info: Onboarding) {
    return updateData('onboarding', info);
  }

  async function removeOnboarding(onboardingName: string) {
    const info = await retrieveData('onboarding');
    delete info[onboardingName];
    browser.storage.local.set({ onboarding: info }).then();
  }

  return {
    retrieveProfile,
    updateProfile,
    retrieveConfigs,
    updateConfigs,
    retrieveModules,
    updateModules,
    updatePrivacyLevel,
    retrieveFilters,
    retrieveAll,
    storeAll,
    saveModuleSettings,
    retrieveData,
    updateData,
    storeData,
    storeFilters,
    saveMessage,
    removeMessage,
    retrieveMessages,
    removeModule,
    createTask,
    endTask,
    loadAllModuleTaskIds,
    getVersion,
    retrieveOnboarding,
    updateOnboarding,
    removeOnboarding,
  };
})();
export { storageHelper };
