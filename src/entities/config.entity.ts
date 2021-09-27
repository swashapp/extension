import browser from 'webextension-polyfill';

import apiCallJson from '../js/configs/apiCall.json';
import communityJson from '../js/configs/community.json';
import configJson from '../js/configs/config.json';
import memberManagerJson from '../js/configs/memberManager.json';
import onboardingJson from '../js/configs/onboarding.json';
import streamJson from '../js/configs/stream.json';
import swashAPIJson from '../js/configs/swashAPI.json';
import { Configs } from '../types/storage/configs.type';
import { ApiConfigs } from '../types/storage/configs/api.type';
import { CommunityConfigs } from '../types/storage/configs/community.type';
import { MemberManagerConfigs } from '../types/storage/configs/member-manager.type';
import { OnboardingConfigs } from '../types/storage/configs/onboarding.type';
import { StreamConfigs } from '../types/storage/configs/stream.type';

import { SwashApiConfigs } from '../types/storage/configs/swash-api.type';

import { Entity } from './entity';

export class ConfigEntity extends Entity<Configs> {
  private static instance: ConfigEntity;

  public static async getInstance(): Promise<ConfigEntity> {
    if (!this.instance) {
      this.instance = new ConfigEntity();
      await this.instance.init();
    }
    return this.instance;
  }

  private constructor() {
    super('configs');
  }

  protected async init(): Promise<void> {
    await this.create({
      name: browser.runtime.getManifest().name,
      description: browser.runtime.getManifest().description || '',
      path: '/',
      delay: 2,
      is_enabled: true,
      privacyLevel: 'auto',
      homepage_url: browser.runtime.getManifest().homepage_url || '',
      version: browser.runtime.getManifest().version,
      manifest: { ...configJson },
      swashAPI: { ...swashAPIJson },
      community: { ...communityJson },
      stream: { ...streamJson },
      onboarding: { ...onboardingJson },
      memberManager: { ...memberManagerJson },
      apiCall: { ...apiCallJson },
    });
  }

  public getCommunityConfig(): CommunityConfigs {
    return this.cache.community;
  }

  public getMemberManagerConfig(): MemberManagerConfigs {
    return this.cache.memberManager;
  }

  public getStreamConfig(): StreamConfigs {
    return this.cache.stream;
  }

  public getApiConfig(): ApiConfigs {
    return this.cache.apiCall;
  }

  public getSwashApiConfig(): SwashApiConfigs {
    return this.cache.swashAPI;
  }

  public getOnboardingConfig(): OnboardingConfigs {
    return this.cache.onboarding;
  }
}
