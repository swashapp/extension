// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { utils } from './utils';

const storageHelper = (function () {
  const messages = {};
  const functionList = ['content', 'browsing', 'apiCall', 'context', 'task'];

  function retrieveProfile() {
    return retrieveData('profile');
  }

  function updateProfile(info) {
    return updateData('profile', info);
  }

  function retrieveFilters() {
    return retrieveData('filters');
  }

  function retrieveConfigs() {
    return retrieveData('configs');
  }

  function updateConfigs(info) {
    return updateData('configs', info);
  }

  function storeFilters(filters) {
    return updateData('filters', filters);
  }

  function retrieveModules() {
    return retrieveData('modules');
  }

  function updateModules(info) {
    return updateData('modules', info);
  }

  async function removeModule(moduleName) {
    const info = await retrieveData('modules');
    delete info[moduleName];
    browser.storage.local.set({ modules: info });
  }

  function saveMessage(msg, id) {
    messages[id] = msg;
  }

  function removeMessage(id) {
    /*
        var info = await retrieveData("messages");
        delete info[id];
        browser.storage.local.set({messages:info});*/
    delete messages[id];
  }

  function retrieveMessages() {
    return messages;
  }

  async function storeAll(db) {
    await browser.storage.local.set(db);
  }

  function retrieveAll() {
    return browser.storage.local.get();
  }

  async function updateData(key, info) {
    const data = await retrieveData(key);
    utils.jsonUpdate(data, info);
    const x = {};
    x[key] = data;
    return browser.storage.local.set(x);
  }

  async function storeData(key, info) {
    const x = {};
    x[key] = info;
    return browser.storage.local.set(x);
  }

  async function retrieveData(key) {
    const x = await browser.storage.local.get(key);
    return x[key];
  }

  async function createTask(info) {
    const tasks = await retrieveData('tasks');
    if (!tasks[info.moduleName]) tasks[info.moduleName] = {};
    tasks[info.moduleName][info.name] = {
      startTime: info.startTime,
      taskId: info.taskId,
      endTime: -1,
      success: 'unknown',
    };
    const x = {};
    x['tasks'] = tasks;
    browser.storage.local.set(x);
  }

  async function endTask(info) {
    const tasks = await retrieveData('tasks');
    if (!info || !tasks[info.moduleName] || !tasks[info.moduleName][info.name])
      return;
    const res = Object.assign({}, tasks[info.moduleName][info.name]);
    delete tasks[info.moduleName][info.name];

    const x = {};
    x['tasks'] = tasks;
    browser.storage.local.set(x);
    return res;
  }

  async function loadAllModuleTaskIds(moduleName) {
    const tasks = await retrieveData('tasks');
    return tasks[moduleName];
  }

  function updateFunctionSettings(module, functionName, settings) {
    if (module.functions.includes(functionName)) {
      for (const item of module[functionName].items) {
        item.is_enabled = settings[functionName][item.name];
      }
    }
  }

  function updatePrivacyLevel(privacyLevel) {
    const key = 'configs';
    const info = { privacyLevel: privacyLevel };
    return updateData(key, info);
  }

  async function saveModuleSettings(moduleName, settings) {
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

  function updateOnboarding(info) {
    return updateData('onboarding', info);
  }

  async function removeOnboarding(onboardingName) {
    const info = await retrieveData('onboarding');
    delete info[onboardingName];
    browser.storage.local.set({ onboarding: info });
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
