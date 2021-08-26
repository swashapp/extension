import { Any } from '../any.type';

export type ManifestCategory = {
  [key: string]: Any;
};

export type ConfigManifest = {
  version: string;
  remotePath: string;
  updateInterval: number;
  files: Any;
  categories: ManifestCategory;
};

export type Config = {
  manifest?: ConfigManifest;
  [key: string]: Any;
};
