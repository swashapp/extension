import {
  Configs,
  ConfigsManifest,
  ManifestCategory,
} from '../types/storage/configs.type';
import { Module } from '../types/storage/module.type';

import { storageHelper } from './storageHelper';

const configManager = (function () {
  const confPath = 'js/configs/';
  const modulePath = 'js/modules/';
  let configs: Configs = {};
  let categories: ManifestCategory = {};
  let modules: { [key: string]: Module } = {};
  async function loadAll() {
    console.log('Try loading configuration files and modules...');
    //First check memory configs
    if (Object.keys(configs).length > 0 && Object.keys(modules).length > 0)
      return;

    //Next check storage configs
    const sConfigs = await storageHelper.retrieveConfigs();
    if (sConfigs && sConfigs.manifest && sConfigs.manifest.length > 0)
      configs = sConfigs;
    else await importConfs();

    //Next check storage modules
    const sModules = await storageHelper.retrieveModules();
    if (sModules && Object.keys(sModules).length > 0) modules = sModules;
    else await importModules();
  }

  async function importAll() {
    configs = {};
    modules = {};
    categories = {};

    await importConfs();
    await importModules();
  }

  async function importConfs() {
    console.log('Try importing configuration files...');
    try {
      if (!configs.manifest)
        configs.manifest = await (
          await fetch(`${confPath}config.json`, { cache: 'no-store' })
        ).json();

      if (!configs.manifest) return;

      //importing configuration files
      for (const file in configs.manifest.files) {
        await importConfig(file);
      }
    } catch (err) {
      console.log(`Import error: ${err}`);
    }
  }

  async function importModules() {
    console.log('Try importing modules...');
    try {
      if (!configs.manifest)
        configs.manifest = await (
          await fetch(`${confPath}config.json`, { cache: 'no-store' })
        ).json();

      if (!configs.manifest) return;

      //importing modules
      for (const category in configs.manifest.categories) {
        categories[category] = {};
        categories[category].icon = configs.manifest.categories[category].icon;
        for (const name in configs.manifest.categories[category].modules)
          await importModule(
            category,
            name,
            configs.manifest.categories[category].modules[name]['version'],
          );
      }
    } catch (err) {
      console.log(`Import error: ${err}`);
    }
  }
  async function importConfig(name: string) {
    const cPath = `${confPath}${name}.json`;
    try {
      const conf = await (await fetch(cPath, { cache: 'no-store' })).json();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      configs[name] = conf;
      console.log(`Configuration file ${name} is imported`);
    } catch (err) {
      console.log(`Error while importing configuration file ${name}: ${err}`);
    }
  }

  async function importModule(category: string, name: string, version: string) {
    const mPath = `${modulePath}${category}/${name}/config.json`;
    try {
      const module = await (await fetch(mPath, { cache: 'no-store' })).json();
      if (!module || !module.functions) throw 'Bad configuration file';
      const mFunctions = module.functions;
      module['category'] = category;
      module['version'] = version;
      for (const func of mFunctions) {
        module[func] = await importModuleFunction(category, name, func);
      }
      modules[module.name] = module;
      console.log(`Module ${category}:${name} is imported`);
    } catch (err) {
      console.log(`Error while importing module ${category}:${name}: ${err}`);
    }
  }

  async function importModuleFunction(
    category: string,
    name: string,
    func: string,
  ) {
    const mFPath = `${modulePath}${category}/${name}/${func}.json`;
    try {
      const mFunc = await (await fetch(mFPath, { cache: 'no-store' })).json();
      if (!mFunc) throw 'Bad configuration file';
      console.log(
        `Function ${func} for module ${category}:${name} is imported`,
      );
      return mFunc;
    } catch (err) {
      console.log(
        `Error while importing function ${func} for module ${category}:${name}: ${err}`,
      );
    }
  }

  async function storeConfigs() {
    storageHelper.storeData('configs', configs).then();
  }

  async function storeModules() {
    storageHelper.storeData('modules', modules).then();
  }

  async function updateAll() {
    console.log('Try updating...');
    try {
      if (!configs.manifest)
        configs.manifest = await (
          await fetch(`${confPath}config.json`, { cache: 'no-store' })
        ).json();

      if (!configs.manifest) return;

      const manifestPath = `${configs.manifest.remotePath}/configs/config.json`;
      const remoteManifest: ConfigsManifest = await (
        await fetch(manifestPath, { cache: 'no-store' })
      ).json();
      //update configuration files
      for (const file in remoteManifest.files) {
        if (
          configs.manifest.files[file] &&
          remoteManifest.files[file].version >
            configs.manifest.files[file].version
        ) {
          await updateConfig(file, remoteManifest.files[file].version);
        }
      }

      //update modules
      for (const category in remoteManifest.categories) {
        if (!configs.manifest.categories[category]) {
          console.log(`Adding new category with name ${category}`);
          configs.manifest.categories[category] = { modules: {}, icon: '' };
          categories[category] = {};
          categories[category].icon = remoteManifest.categories[category].icon;
        }

        for (const module in remoteManifest.categories[category].modules) {
          if (!configs.manifest.categories[category].modules[module]) {
            configs.manifest.categories[category].modules[module] = {
              version: 0,
            };
            console.log(
              `Adding new module with name ${module} to the category ${category}`,
            );
          }
          if (
            remoteManifest.categories[category].modules[module].version >
            configs.manifest.categories[category].modules[module].version
          ) {
            await updateModule(
              category,
              module,
              remoteManifest.categories[category].modules[module].version,
            );
          }
        }
      }
    } catch (err) {
      console.log(`Updating error: ${err}`);
    }
  }

  async function updateConfig(file: string, version: number) {
    if (!configs.manifest) return;
    console.log(`Updating configuration file ${file}`);
    const confPath = `${configs.manifest.remotePath}configs/${file}.json`;
    try {
      const conf = await (await fetch(confPath, { cache: 'no-store' })).json();
      if (conf) {
        console.log(
          `Configuration file ${file} updated from version ${configs.manifest.files[file].version} to ${version}`,
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        configs[file] = conf;
        configs.manifest.files[file].version = version;
      }
    } catch (err) {
      console.log(`Error on Updating configuration file ${file}: ${err}`);
    }
  }

  async function updateModule(category: string, name: string, version: string) {
    if (!configs.manifest) return;
    console.log(`Updating module ${category}:${name}`);
    const mPath = `${configs.manifest.remotePath}modules/${category}/${name}/config.json`;
    try {
      const module = await (await fetch(mPath, { cache: 'no-store' })).json();
      if (!module || !module.functions) throw 'Bad configuration file';

      module['category'] = category;
      module['version'] = version;
      const mFunctions = module.functions;
      for (const func of mFunctions) {
        const mFPath = `${configs.manifest.remotePath}modules/${category}/${name}/${func}.json`;
        const mFunc = await (await fetch(mFPath, { cache: 'no-store' })).json();
        if (!mFunc) throw 'Bad configuration file';
        module[func] = mFunc;
      }
      modules[module.name] = module;
      console.log(
        `Module ${category}:${name} updated from version ${configs.manifest.categories[category].modules[name].version} to ${version}`,
      );
      configs.manifest.categories[category].modules[name].version = version;
    } catch (err) {
      console.log(`Error while updating module ${category}:${name}: ${err}`);
    }
  }

  async function getCategory(name: string) {
    let category = categories[name];
    //first check memory
    if (category) return category;

    //then check local manifest
    if (!configs.manifest)
      configs.manifest = await (
        await fetch(`${confPath}config.json`, { cache: 'no-store' })
      ).json();
    if (!configs.manifest) return;
    category = configs.manifest.categories[name];
    if (category) {
      categories[name] = category;
      return category;
    }

    //finally try importing remote manifest
    const manifestPath = `${configs.manifest.remotePath}/configs/config.json`;
    const remoteManifest = await (
      await fetch(manifestPath, { cache: 'no-store' })
    ).json();
    category = remoteManifest.categories[name];
    if (category) {
      categories[name] = category;
      return category;
    }

    return {};
  }

  function getConfig(name: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return configs[name];
  }

  function getAllConfigs() {
    return configs;
  }

  function getModule(name: string) {
    return modules[name];
  }

  function getAllModules() {
    return modules;
  }

  return {
    importAll,
    importConfs,
    importModules,
    loadAll,
    importConfig,
    importModule,
    storeConfigs,
    storeModules,
    updateAll,
    getConfig,
    getAllConfigs,
    getModule,
    getCategory,
    getAllModules,
  };
})();

export { configManager };
