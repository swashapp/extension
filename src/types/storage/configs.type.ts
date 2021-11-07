import { ApiConfigs } from './configs/api.type';
import { CommunityConfigs } from './configs/community.type';
import { MemberManagerConfigs } from './configs/member-manager.type';
import { OnboardingConfigs } from './configs/onboarding.type';
import { StreamConfigs } from './configs/stream.type';
import { SwashApiConfigs } from './configs/swash-api.type';

export type ManifestCategory = {
  [key: string]: {
    icon: string;
    modules: {
      [key: string]: { version: number };
    };
  };
};

export type ManifestFiles = { [key: string]: { version: number } };

export type ConfigsManifest = {
  version: number;
  remotePath: string;
  updateInterval: number;
  files: ManifestFiles;
  categories: ManifestCategory;
};

export type Configs = {
  Id: string;
  salt: string;
  delay: number;
  name: string;
  description: string;
  path: string;
  is_enabled: boolean;
  privacyLevel: string;
  homepage_url: string;
  version: string;
  manifest: ConfigsManifest;
  swashAPI: SwashApiConfigs;
  community: CommunityConfigs;
  stream: StreamConfigs;
  onboarding: OnboardingConfigs;
  memberManager: MemberManagerConfigs;
  apiCall: ApiConfigs;
};
