import { Any } from '../types/any.type';
import { Module, Modules } from '../types/storage/module.type';
import { commonUtils } from '../utils/common.util';

import { ConfigEntity } from './config.entity';
import { Entity } from './entity';

const base = 'core/modules';

async function fetchModule(
  category: string,
  name: string,
  version: number,
): Promise<Module> {
  const module = await commonUtils.dlJson<Module>(
    `${base}/${category}/${name}/config.json`,
  );
  if (!module || !module.functions) throw 'Bad module configuration file';

  module.category = category;
  module.version = version;

  for (const func of module.functions) {
    module[func] = await fetchModuleFunction(category, name, func);
  }
  console.log(`Module ${category}:${name} is fetched`);
  return module;
}

async function fetchModuleFunction(
  category: string,
  module: string,
  name: string,
): Promise<Any> {
  const func = await commonUtils.dlJson(
    `${base}/${category}/${module}/${name}.json`,
  );
  if (!func) throw `Failed to fetch function ${name} for module ${module}`;

  console.log(`Function ${name} for module ${category}:${module} is fetched`);
  return func;
}

async function fetchModules() {
  console.log('Try fetching modules...');
  const modules: Any = {};
  const configs = await ConfigEntity.getInstance();
  const categories = (await configs.get()).manifest.categories;

  for (const category of Object.keys(categories)) {
    const _modules = categories[category].modules;
    if (!_modules) continue;

    for (const name of Object.keys(_modules)) {
      try {
        const version = _modules[name].version;
        const module = await fetchModule(category, name, version);
        modules[module.name] = module;
      } catch (err) {
        console.error(`Failed to fetch module ${category}:${name}: ${err}`);
      }
    }
  }

  return modules;
}

export class ModuleEntity extends Entity<Modules> {
  private static instance: ModuleEntity;

  public static async getInstance(): Promise<ModuleEntity> {
    if (!this.instance) {
      this.instance = new ModuleEntity();
      await this.instance.init();
    }
    return this.instance;
  }

  private constructor() {
    super('modules');
  }

  protected async init(): Promise<void> {
    await this.create(await fetchModules());
  }

  public async upgrade(): Promise<void> {
    return this.save(await fetchModules());
  }
}
