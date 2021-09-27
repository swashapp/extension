import { Module } from './storage/module.type';

export type Functions = {
  initModule: (module: Module) => void;
  load: () => void;
  unload: () => void;
  loadModule: (module: Module) => void;
  unloadModule: (module: Module) => void;
};
