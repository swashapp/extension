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
  let memberManagerConfig: MemberManagerConfigs;
  let tryInterval: number;

  async function init() {
    memberManagerConfig = await configManager.getConfig('memberManager');
    if (memberManagerConfig) tryInterval = memberManagerConfig.tryInterval;
  }

  async function checkJoin() {
    const states = await storageHelper.getStates();
    console.log(`Trying to join...`);

    if (commonUtils.isToday(new Date(states.lastUserJoin))) {
      console.log('No need to join user today');
      charityHelper.startAutoPayment().catch(console.error);
      tryInterval = memberManagerConfig.heartbeatInterval;
      clearJoinStrategy();
      tryJoin().catch(console.error);
      return;
    }

    try {
      joined = await userHelper.isJoinedSwash();
      if (!joined) {
        console.log(`User is not joined`);
        clearJoinStrategy();
        onboarding
          .repeatOnboarding([
            OnboardingPageValues.Join,
            OnboardingPageValues.Completed,
          ])
          .then();
      } else {
        console.log(`User is already joined`);
        states.lastUserJoin = Date.now();
        console.log(
          `User last join submitted on ${new Date(states.lastUserJoin)}`,
        );
        await storageHelper.saveStates(states);
        charityHelper.startAutoPayment().catch(console.error);
        tryInterval = memberManagerConfig.heartbeatInterval;
        clearJoinStrategy();
        tryJoin().catch(console.error);
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
        tryInterval *= memberManagerConfig.backoffRate;
        if (tryInterval > memberManagerConfig.maxInterval)
          tryInterval = memberManagerConfig.maxInterval;
        console.log(`Increased try join interval to ${tryInterval}`);
        clearJoinStrategy();
        tryJoin().catch(console.error);
      }
    }
  }

  async function tryJoin() {
    if (!tryTimer && !joined) tryTimer = setInterval(checkJoin, tryInterval);
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
