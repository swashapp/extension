import { StreamCategory } from "@/enums/stream.enum";

import { OnDiskModule } from "../handler/module.type";

export type ModuleConfiguration = Record<
  StreamCategory,
  Record<string, OnDiskModule>
>;

export type ConfigurationStorage = {
  modules: ModuleConfiguration;
};
