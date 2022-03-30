import { ConfigsManifest } from '../types/storage/configs.type';
import { Module } from '../types/storage/module.type';
import { commonUtils } from '../utils/common.util';

import { storageHelper } from './storageHelper';

const configManager = (function () {
  async function updateAll() {
    console.log('Try updating...');
    const configs = await storageHelper.getConfigs();
    const modules = await storageHelper.getModules();
    const remotePath = configs.manifest.remotePath;

    try {
      const manifestPath = `${remotePath}configs/config.json`;
      const remoteManifest = await commonUtils.dlJson<ConfigsManifest>(
        manifestPath,
      );

      await updateConfigs(remoteManifest);
      await updateModules(remoteManifest);
      console.log(`Updated successfully`);
    } catch (err) {
      console.error(`Updating error: ${err}`);
    }

    async function updateConfigs(remoteManifest: ConfigsManifest) {
      let updated = false;
      for (const [name, file] of Object.entries(remoteManifest.files)) {
        if (file.version > configs.manifest.files[name].version) {
          try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            configs[name] = await updateConfig(remotePath, name);
            console.log(
              `Configuration file ${file} updated from version ${configs.manifest.files[name].version} to ${file.version}`,
            );
            configs.manifest.files[name].version = file.version;
            updated = true;
          } catch (err) {
            console.error(
              `Error while importing configuration file ${name}: ${err}`,
            );
          }
        }
      }
      if (updated) await storageHelper.saveConfigs(configs);
    }

    async function updateConfig(remote: string, file: string) {
      console.log(`Updating configuration file ${file}`);
      const confPath = `${remote}configs/${file}.json`;

      return commonUtils.dlJson(confPath);
    }

    async function updateModules(remoteManifest: ConfigsManifest) {
      let updated = false;
      for (const [name, category] of Object.entries(
        remoteManifest.categories,
      )) {
        if (!configs.manifest.categories[name]) {
          console.log(`Adding new category with name ${name}`);
          configs.manifest.categories[name] = {
            modules: {},
            icon: category.icon,
          };
        }

        if (!category.modules) continue;

        for (const module of Object.keys(category.modules)) {
          if (!configs.manifest.categories[name].modules[module]) {
            configs.manifest.categories[name].modules[module] = {
              version: 0,
            };
            console.log(
              `Adding new module with name ${module} to the category ${name}`,
            );
          }

          const oldVersion =
            configs.manifest.categories[name].modules[module].version;
          const newVersion = category.modules[module].version;

          if (newVersion > oldVersion) {
            try {
              const newModule = await updateModule(
                remotePath,
                name,
                module,
                newVersion,
              );
              modules[newModule.name] = newModule;
              configs.manifest.categories[name].modules[module].version =
                newVersion;
              updated = true;
              console.log(
                `Module ${name}:${module} updated from version ${oldVersion} to ${newVersion}`,
              );
            } catch (err) {
              console.error(
                `Error while importing module ${name}:${module}: ${err}`,
              );
            }
          }
        }
      }
      if (updated) {
        await storageHelper.saveConfigs(configs);
        await storageHelper.saveModules(modules);
      }
    }

    async function updateModule(
      remote: string,
      category: string,
      name: string,
      version: number,
    ): Promise<Module> {
      console.log(`Updating module ${category}:${name}`);
      const mPath = `${remote}modules/${category}/${name}/config.json`;

      const module = await commonUtils.dlJson<Module>(mPath);
      if (!module || !module.functions) throw 'Bad configuration file';

      module.category = category;
      module.version = version;
      const functions = module.functions;
      for (const func of functions) {
        const newFunction = await commonUtils.dlJson(
          `${remote}modules/${category}/${name}/${func}.json`,
        );
        if (!newFunction) throw 'Bad configuration file';
        module[func] = newFunction;
      }
      return module;
    }
  }

  async function getConfig(name: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return (await storageHelper.getConfigs())[name];
  }

  function getAllConfigs() {
    return storageHelper.getConfigs();
  }

  async function getModule(name: string) {
    return (await storageHelper.getModules())[name];
  }

  function getAllModules() {
    return storageHelper.getModules();
  }

  return {
    updateAll,
    getConfig,
    getAllConfigs,
    getModule,
    getAllModules,
  };
})();

export { configManager };
