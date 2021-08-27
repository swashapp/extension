import { ConfigFiles } from '../../enums/configs.enum';
import { Any } from '../any.type';

import { ApiConfigs } from './api.type';
import { CommunityConfigs } from './community.type';
import { MemberManagerConfigs } from './member-manager.type';
import { OnboardingConfigs } from './onboarding.type';
import { StreamConfigs } from './stream.type';
import { SwashApiConfigs } from './swash-api.type';

export type ManifestCategory = {
  [key: string]: Any;
};

export type ConfigsManifest = {
  version: string;
  remotePath: string;
  updateInterval: number;
  files: { [key: string]: { version: number } };
  categories: ManifestCategory;
  [key: string]: Any;
};

export type Configs = {
  Id?: string;
  salt?: string;
  delay?: number;
  name?: string;
  description?: string;
  path?: string;
  is_enabled?: boolean;
  privacyLevel?: string;
  homepage_url?: string;
  version?: string;
  manifest?: ConfigsManifest;
  swashAPI?: SwashApiConfigs;
  community?: CommunityConfigs;
  stream?: StreamConfigs;
  onboarding?: OnboardingConfigs;
  memberManager?: MemberManagerConfigs;
  apiCall?: ApiConfigs;
};
