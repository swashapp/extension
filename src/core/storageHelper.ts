import { Banner } from 'types/storage/banner.type';
import browser from 'webextension-polyfill';

import { BannerEntity } from '../entities/banner.entity';

import { ConfigEntity } from '../entities/config.entity';
import { FilterEntity } from '../entities/filter.entity';
import { ModuleEntity } from '../entities/module.entity';
import { OnboardingEntity } from '../entities/onboarding.entity';
import { PrivacyDataEntity } from '../entities/privacy-data.entity';
import { ProfileEntity } from '../entities/profile.entity';
import { Any } from '../types/any.type';
import { Configs } from '../types/storage/configs.type';
import { Filter } from '../types/storage/filter.type';
import { Module, ModuleFunction, Modules } from '../types/storage/module.type';
import { Onboarding } from '../types/storage/onboarding.type';
import { PrivacyData } from '../types/storage/privacy-data.type';
import { Profile } from '../types/storage/profile.type';

const storageHelper = (function () {
  const functionList: ModuleFunction[] = [
    'content',
    'browsing',
    'apiCall',
    'context',
    'task',
  ];

  async function getAll() {
    return browser.storage.local.get();
  }

  async function saveAll(db: Any) {
    return browser.storage.local.set(db);
  }

  async function getConfigs() {
    return (await ConfigEntity.getInstance()).get();
  }

  async function saveConfigs(conf: Configs) {
    return (await ConfigEntity.getInstance()).save(conf);
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

  async function getFilters() {
    return (await FilterEntity.getInstance()).get();
  }

  async function saveFilters(filters: Filter[]) {
    return (await FilterEntity.getInstance()).save(filters);
  }

  async function getPrivacyData() {
    return (await PrivacyDataEntity.getInstance()).get();
  }

  async function savePrivacyData(privacyData: PrivacyData[]) {
    return (await PrivacyDataEntity.getInstance()).save(privacyData);
  }

  async function saveBanner(banner: Banner) {
    return (await BannerEntity.getInstance()).save(banner);
  }

  async function getBanner() {
    return (await BannerEntity.getInstance()).get();
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
    updateConfigs,
    getModules,
    saveModules,
    getOnboarding,
    saveOnboarding,
    getProfile,
    saveProfile,
    getFilters,
    saveFilters,
    getPrivacyData,
    savePrivacyData,
    saveModuleSettings,
    saveBanner,
    getBanner,
  };
})();
export { storageHelper };
