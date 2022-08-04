import browser from 'webextension-polyfill';

import apiCallJson from '../core/configs/apiCall.json';
import communityJson from '../core/configs/community.json';
import configJson from '../core/configs/config.json';
import graphAPIJson from '../core/configs/graphAPI.json';
import memberManagerJson from '../core/configs/memberManager.json';
import onboardingJson from '../core/configs/onboarding.json';
import streamJson from '../core/configs/stream.json';
import swashAPIJson from '../core/configs/swashAPI.json';
import { Configs } from '../types/storage/configs.type';
import { ApiConfigs } from '../types/storage/configs/api.type';
import { CommunityConfigs } from '../types/storage/configs/community.type';
import { MemberManagerConfigs } from '../types/storage/configs/member-manager.type';
import { OnboardingConfigs } from '../types/storage/configs/onboarding.type';
import { StreamConfigs } from '../types/storage/configs/stream.type';

import { SwashApiConfigs } from '../types/storage/configs/swash-api.type';

import { commonUtils } from '../utils/common.util';

import { Entity } from './entity';

function getStaticConfig() {
  return {
    name: browser.runtime.getManifest().name,
    description: browser.runtime.getManifest().description || '',
    path: '/',
    privacyLevel: 'auto',
    homepage_url: browser.runtime.getManifest().homepage_url || '',
    version: browser.runtime.getManifest().version,
    manifest: { ...configJson },
    swashAPI: { ...swashAPIJson },
    graphAPI: { ...graphAPIJson },
    community: { ...communityJson },
    stream: { ...streamJson },
    onboarding: { ...onboardingJson },
    memberManager: { ...memberManagerJson },
    apiCall: { ...apiCallJson },
  };
}

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
      Id: commonUtils.uuid(),
      salt: commonUtils.uuid(),
      delay: 2,
      is_enabled: true,
      ...getStaticConfig(),
    });
  }

  public async upgrade(): Promise<void> {
    return this.save({
      Id: this.cache.Id,
      salt: this.cache.salt,
      delay: this.cache.delay,
      is_enabled: this.cache.is_enabled,
      ...getStaticConfig(),
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
