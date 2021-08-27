import { Configs } from './configs/configs.type';
import { Filter } from './filter.type';
import { Modules } from './module.type';
import { Onboarding } from './onboarding.type';
import { PrivacyData } from './privacy-data.type';
import { Profile } from './profile.type';

export type Storage = {
  _backup: string;
  configs: Configs;
  filters: Filter[];
  modules: Modules;
  onboarding: Onboarding;
  privacyData: PrivacyData;
  profile: Profile;
};
