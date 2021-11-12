import browser from 'webextension-polyfill';

import { ConfigEntity } from '../entities/config.entity';
import { OnboardingPageValues } from '../enums/onboarding.enum';
import { MemberManagerConfigs } from '../types/storage/configs/member-manager.type';

import { configManager } from './configManager';
import { databaseHelper } from './databaseHelper';
import { onboarding } from './onboarding';
import { pageAction } from './pageAction';
import { userHelper } from './userHelper';

const memberManager = (function () {
  let joined: boolean | undefined;
  let failedCount = 0;
  let mgmtInterval: NodeJS.Timer | undefined;
  let memberManagerConfig: MemberManagerConfigs;
  let strategyInterval: number;

  async function init() {
    memberManagerConfig = await configManager.getConfig('memberManager');
    if (memberManagerConfig) strategyInterval = memberManagerConfig.tryInterval;
  }

  function updateStatus(strategy: string) {
    console.log(`${strategy}: Trying to join...`);
    userHelper.isJoinedSwash().then((status) => {
      joined = status;
      if (!status) {
        console.log(`${strategy}: user is not joined`);
        failedCount++;

        if (failedCount > memberManagerConfig.failuresThreshold) {
          clearJoinStrategy();
          failedCount = 0;
          console.log(`need to join swash again`);
          onboarding
            .repeatOnboarding([
              OnboardingPageValues.Join,
              OnboardingPageValues.Completed,
            ])
            .then();
        }
      } else if (status) {
        console.log(`${strategy}: user is already joined`);
        clearJoinStrategy();
        strategyInterval = memberManagerConfig.tryInterval;
        tryJoin().catch(console.error);
        browser.tabs
          .query({ currentWindow: true, active: true })
          .then((tabs) => {
            const tab = tabs[0];
            pageAction.loadIcons(tab.url);
          }, console.error);
      } else {
        console.log(`${strategy}: failed to get user join status`);
        if (strategyInterval < memberManagerConfig.maxInterval) {
          clearJoinStrategy();
          strategyInterval *= memberManagerConfig.backoffRate;
          if (strategyInterval > memberManagerConfig.maxInterval)
            strategyInterval = memberManagerConfig.maxInterval;
          tryJoin().catch(console.error);
        }
      }
    });
  }

  const strategies = (function () {
    async function fixedTimeWindowStrategy() {
      const messageCount = await databaseHelper.getTotalMessageCount();
      const lastSentDate = await databaseHelper.getLastSentDate();
      const currentTime = new Date().getTime();
      if (
        !joined &&
        messageCount >= memberManagerConfig.minimumMessageNumber &&
        lastSentDate + memberManagerConfig.sendTimeWindow >= currentTime
      ) {
        updateStatus('FixedTimeWindowStrategy');
      }

      if (
        joined &&
        lastSentDate + memberManagerConfig.sendTimeWindow < currentTime
      ) {
        updateStatus('FixedTimeWindowStrategy');
      }
    }

    async function dynamicTimeWindowStrategy() {
      const messageCount = await databaseHelper.getTotalMessageCount();
      const lastSentDate = await databaseHelper.getLastSentDate();
      const currentTime = new Date().getTime();
      if (
        !joined &&
        messageCount >= memberManagerConfig.minimumMessageNumber &&
        lastSentDate + messageCount * 60 * 1000 >= currentTime
      ) {
        updateStatus('DynamicTimeWindowStrategy');
      }

      if (joined && lastSentDate + messageCount * 60 * 1000 < currentTime) {
        updateStatus('DynamicTimeWindowStrategy');
      }
    }

    async function immediateJoinStrategy() {
      if (!joined) {
        updateStatus('ImmediateJoinStrategy');
      }
    }

    return {
      fixedTimeWindowStrategy,
      dynamicTimeWindowStrategy,
      immediateJoinStrategy,
    };
  })();

  async function tryJoin() {
    const configs = await (await ConfigEntity.getInstance()).get();
    if (!mgmtInterval && configs.is_enabled)
      mgmtInterval = setInterval(
        strategies[memberManagerConfig.strategy],
        strategyInterval,
      );
  }

  function clearJoinStrategy() {
    mgmtInterval && clearInterval(mgmtInterval);
    mgmtInterval = undefined;
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
