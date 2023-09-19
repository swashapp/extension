import { Notifications } from 'types/storage/notifications.type';
import browser from 'webextension-polyfill';

import { AdsEntity } from '../entities/ads.entity';
import { CharityEntity } from '../entities/charity.entity';
import { ConfigEntity } from '../entities/config.entity';
import { FilterEntity } from '../entities/filter.entity';
import { ModuleEntity } from '../entities/module.entity';
import { NewTabEntity } from '../entities/new-tab.entity';
import { NotificationsEntity } from '../entities/notifications.entity';
import { OnboardingEntity } from '../entities/onboarding.entity';
import { PrivacyDataEntity } from '../entities/privacy-data.entity';
import { ProfileEntity } from '../entities/profile.entity';
import { StateEntity } from '../entities/state.entity';
import { Any } from '../types/any.type';
import { AdsConfig } from '../types/storage/ads-config.type';
import { Charity } from '../types/storage/charity.type';
import { Configs } from '../types/storage/configs.type';
import { Filter } from '../types/storage/filter.type';
import { Module, ModuleFunction, Modules } from '../types/storage/module.type';
import { NewTab } from '../types/storage/new-tab.type';
import { Onboarding } from '../types/storage/onboarding.type';
import { PrivacyData } from '../types/storage/privacy-data.type';
import { Profile } from '../types/storage/profile.type';
import { State } from '../types/storage/state.type';

const storageHelper = (function () {
  const functionList: ModuleFunction[] = [
    'content',
    'browsing',
    'apiCall',
    'context',
    'task',
    'ads',
  ];

  async function getAll() {
    return browser.storage.local.get();
  }

  async function saveAll(db: Any) {
    const result = browser.storage.local.set(db);
    await (await AdsEntity.getInstance()).get(false);
    await (await CharityEntity.getInstance()).get(false);
    await (await ConfigEntity.getInstance()).get(false);
    await (await FilterEntity.getInstance()).get(false);
    await (await ModuleEntity.getInstance()).get(false);
    await (await NewTabEntity.getInstance()).get(false);
    await (await NotificationsEntity.getInstance()).get(false);
    await (await OnboardingEntity.getInstance()).get(false);
    await (await PrivacyDataEntity.getInstance()).get(false);
    await (await ProfileEntity.getInstance()).get(false);
    await (await StateEntity.getInstance()).get(false);
    return result;
  }

  async function getConfigs() {
    return (await ConfigEntity.getInstance()).get();
  }

  async function saveConfigs(conf: Configs) {
    return (await ConfigEntity.getInstance()).save(conf);
  }

  async function mergeConfigs(conf: Configs) {
    return (await ConfigEntity.getInstance()).merge(conf);
  }

  async function updateConfigs(key: string, value: Any) {
    return (await ConfigEntity.getInstance()).update(key, value);
  }

  async function getModules() {
    return (await ModuleEntity.getInstance()).get();
  }

  async function saveModules(modules: Modules) {
    return (await ModuleEntity.getInstance()).save(modules);
  }

  async function getOnboarding() {
    return (await OnboardingEntity.getInstance()).get();
  }

  async function saveOnboarding(onboarding: Onboarding) {
    return (await OnboardingEntity.getInstance()).save(onboarding);
  }

  async function getProfile() {
    return (await ProfileEntity.getInstance()).get();
  }

  async function saveProfile(profile: Profile) {
    return (await ProfileEntity.getInstance()).save(profile);
  }

  async function mergeProfile(profile: Profile) {
    return (await ProfileEntity.getInstance()).merge(profile);
  }

  async function getFilters() {
    return (await FilterEntity.getInstance()).get();
  }

  async function saveFilters(filters: Filter[]) {
    return (await FilterEntity.getInstance()).save(filters);
  }

  async function mergeFilters(filters: Filter[]) {
    return (await FilterEntity.getInstance()).merge(filters);
  }

  async function getPrivacyData() {
    return (await PrivacyDataEntity.getInstance()).get();
  }

  async function savePrivacyData(privacyData: PrivacyData[]) {
    return (await PrivacyDataEntity.getInstance()).save(privacyData);
  }

  async function mergePrivacyData(privacyData: PrivacyData[]) {
    return (await PrivacyDataEntity.getInstance()).merge(privacyData);
  }

  async function saveNotifications(notifications: Notifications) {
    return (await NotificationsEntity.getInstance()).save(notifications);
  }

  async function getNotifications() {
    return (await NotificationsEntity.getInstance()).get();
  }

  async function saveCharities(charities: Charity[]) {
    return (await CharityEntity.getInstance()).save(charities);
  }

  async function mergeCharities(charities: Charity[]) {
    return (await CharityEntity.getInstance()).merge(charities);
  }

  async function getCharities() {
    return (await CharityEntity.getInstance()).get();
  }

  async function saveNewTab(newTab: NewTab) {
    return (await NewTabEntity.getInstance()).save(newTab);
  }

  async function mergeNewTab(newTab: NewTab) {
    return (await NewTabEntity.getInstance()).merge(newTab);
  }

  async function getNewTab() {
    return (await NewTabEntity.getInstance()).get();
  }

  async function saveAdsConfig(ads: AdsConfig) {
    return (await AdsEntity.getInstance()).save(ads);
  }

  async function mergeAdsConfig(ads: AdsConfig) {
    return (await AdsEntity.getInstance()).merge(ads);
  }

  async function getAdsConfig() {
    return (await AdsEntity.getInstance()).get();
  }

  async function saveStates(state: State) {
    return (await StateEntity.getInstance()).save(state);
  }

  async function mergeStates(state: State) {
    return (await StateEntity.getInstance()).merge(state);
  }

  async function getStates() {
    return await (await StateEntity.getInstance()).get();
  }

  function updateFunctionSettings(
    module: Module,
    functionName: ModuleFunction,
    settings: Any,
  ) {
    if (module.functions.includes(functionName)) {
      for (const item of module[functionName].items) {
        item.is_enabled = settings[functionName][item.name];
      }
    }
  }

  async function saveModuleSettings(moduleName: string, settings: Any) {
    const modules = await getModules();
    const ret = modules[moduleName];
    if (typeof settings.is_enabled != 'undefined')
      ret.is_enabled = settings.is_enabled;
    for (const f of functionList) {
      if (typeof settings[f] != 'undefined')
        updateFunctionSettings(ret, f, settings);
    }
    return saveModules(modules);
  }

  return {
    getAll,
    saveAll,
    getConfigs,
    saveConfigs,
    mergeConfigs,
    updateConfigs,
    getModules,
    saveModules,
    getOnboarding,
    saveOnboarding,
    getProfile,
    saveProfile,
    mergeProfile,
    getFilters,
    saveFilters,
    mergeFilters,
    getPrivacyData,
    savePrivacyData,
    mergePrivacyData,
    saveModuleSettings,
    saveNotifications,
    getNotifications,
    saveCharities,
    mergeCharities,
    getCharities,
    saveNewTab,
    mergeNewTab,
    getNewTab,
    saveAdsConfig,
    mergeAdsConfig,
    getAdsConfig,
    saveStates,
    mergeStates,
    getStates,
  };
})();
export { storageHelper };
