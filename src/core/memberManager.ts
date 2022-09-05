import browser from 'webextension-polyfill';

import { OnboardingPageValues } from '../enums/onboarding.enum';
import { MemberManagerConfigs } from '../types/storage/configs/member-manager.type';

import { commonUtils } from '../utils/common.util';

import { charityHelper } from './charityHelper';
import { configManager } from './configManager';
import { onboarding } from './onboarding';
import { pageAction } from './pageAction';
import { storageHelper } from './storageHelper';
import { userHelper } from './userHelper';

const memberManager = (function () {
  let joined: boolean | undefined;
  let tryTimer: NodeJS.Timer | undefined;
  let heartbeatTimer: NodeJS.Timer | undefined;
  let memberManagerConfig: MemberManagerConfigs;
  let tryInterval: number;

  async function init() {
    memberManagerConfig = await configManager.getConfig('memberManager');
    if (memberManagerConfig) tryInterval = memberManagerConfig.tryInterval;
  }

  async function checkJoin() {
    console.log(`Trying to join...`);
    try {
      joined = await userHelper.isJoinedSwash();
      if (!joined) {
        console.log(`User is not joined`);
        clearJoinStrategy();
        console.log(`Need to join swash again`);
        onboarding
          .repeatOnboarding([
            OnboardingPageValues.Join,
            OnboardingPageValues.Completed,
          ])
          .then();
      } else {
        clearJoinStrategy();
        console.log(`User is already joined`);
        const profile = await storageHelper.getProfile();
        profile.lastCheck = new Date();
        console.log(`User last join submitted on ${profile.lastCheck}`);
        await storageHelper.saveProfile(profile);
        keepAlive().catch(console.error);
        charityHelper.startAutoPayment().catch(console.error);
        tryInterval = memberManagerConfig.tryInterval;
        browser.tabs
          .query({ currentWindow: true, active: true })
          .then((tabs) => {
            const tab = tabs[0];
            pageAction.loadIcons(tab.url);
          }, console.error);
      }
    } catch (err) {
      console.log(`failed to get user join status`);
      if (tryInterval < memberManagerConfig.maxInterval) {
        clearJoinStrategy();
        tryInterval *= memberManagerConfig.backoffRate;
        if (tryInterval > memberManagerConfig.maxInterval)
          tryInterval = memberManagerConfig.maxInterval;
        console.log(`Increased try join interval to ${tryInterval}`);
        tryJoin().catch(console.error);
      }
    }
  }

  async function checkHeartbeat() {
    const profile = await storageHelper.getProfile();
    if (profile.lastCheck && commonUtils.isToday(profile.lastCheck)) return;
    console.log("User heartbeat didn't recorded for today");
    try {
      await userHelper.isJoinedSwash();
      profile.lastCheck = new Date();
      console.log(`User heartbeat submitted on ${profile.lastCheck}`);
      await storageHelper.saveProfile(profile);
    } catch (err) {
      console.error('Failed to submit heartbeat');
    }
  }

  async function tryJoin() {
    if (!tryTimer && !joined) tryTimer = setInterval(checkJoin, tryInterval);
  }

  async function keepAlive() {
    heartbeatTimer && clearInterval(heartbeatTimer);
    heartbeatTimer = setInterval(
      checkHeartbeat,
      memberManagerConfig.heartbeatInterval,
    );
  }

  function clearJoinStrategy() {
    tryTimer && clearInterval(tryTimer);
    tryTimer = undefined;
  }

  function isJoined() {
    return joined;
  }

  return {
    init,
    tryJoin,
    isJoined,
  };
})();

export { memberManager };
