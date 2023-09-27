import browser from 'webextension-polyfill';

import { MemberManagerConfigs } from '../types/storage/configs/member-manager.type';
import { PushNotification } from '../types/storage/notifications.type';

import { configManager } from './configManager';
import { storageHelper } from './storageHelper';
import { swashApiHelper } from './swashApiHelper';
import { userHelper } from './userHelper';

const notificationHelper = (function () {
  let configs: MemberManagerConfigs;
  let inAppId: NodeJS.Timeout;
  let pushId: NodeJS.Timeout;

  async function init() {
    configs = await configManager.getConfig('memberManager');
    addListener();
  }

  function setupJobs() {
    if (!inAppId)
      updateInAppNotifications().finally(() => {
        inAppId = setTimeout(
          updateInAppNotifications,
          configs.inAppNotification.checkInterval,
        );
      });
    if (!pushId)
      updatePushNotifications().finally(() => {
        pushId = setInterval(
          updatePushNotifications,
          configs.pushNotification.checkInterval,
        );
      });
  }

  function addListener() {
    if (!browser.tabs.onCreated.hasListener(raiseNotification)) {
      browser.tabs.onCreated.addListener(raiseNotification);
    }
  }

  async function raiseNotification() {
    const states = await storageHelper.getStates();

    const now = Date.now();
    if (
      states.lastPushNotificationRaise +
        configs.pushNotification.raiseInterval >
      now
    ) {
      console.log('No need to raise a push notifications now');
      return;
    }

    const { inApp, push } = await storageHelper.getNotifications();
    let msg: PushNotification | undefined;

    do {
      msg = push.shift();
    } while (
      msg &&
      msg.expire &&
      msg.expire < states.lastPushNotificationUpdate.timestamp
    );

    if (msg) {
      const id = `swash_push_${Math.random().toString(36).substring(2, 12)}`;
      browser.notifications.create(id, {
        type: 'basic',
        iconUrl: browser.runtime.getURL('static/images/swash/active-96.png'),
        title: msg.title,
        message: msg.text,
      });

      const callback = (notificationId: string) => {
        if (notificationId === id && msg && msg.link) {
          browser.tabs.create({
            url: msg.link.startsWith('ext://')
              ? browser.runtime.getURL(msg.link.replace('ext://', ''))
              : msg.link,
          });
        }
      };
      if (!browser.notifications.onClicked.hasListener(callback))
        browser.notifications.onClicked.addListener(callback);

      storageHelper.saveNotifications({ inApp, push }).catch(console.error);
    }

    states.lastPushNotificationRaise = now;
    storageHelper.saveStates(states).catch(console.error);
  }

  async function updateInAppNotifications() {
    const states = await storageHelper.getStates();
    console.log('Updating in app notifications');

    const now = Date.now();

    if (
      states.lastInAppNotificationUpdate +
        configs.pushNotification.updateInterval >
      now
    ) {
      console.log('No need to update in app notifications now');
      return;
    }

    const serverInAppNotifications = await swashApiHelper.getInAppNotifications(
      await userHelper.generateJWT(),
    );

    if (serverInAppNotifications.length > 0) {
      const { inApp, push } = await storageHelper.getNotifications();
      serverInAppNotifications.forEach((item) => {
        inApp[item.type] = item;
      });
      storageHelper.saveNotifications({ inApp, push }).catch(console.error);
    }

    states.lastInAppNotificationUpdate = now;
    storageHelper.saveStates(states).catch(console.error);
  }

  async function updatePushNotifications() {
    const states = await storageHelper.getStates();
    console.log('Updating push app notifications');

    if (states.serverTimestamp.value === 0) {
      console.log('It should wait to fetch server timestamp');
      return;
    }

    const now = Date.now();

    if (
      states.lastPushNotificationUpdate.check +
        configs.pushNotification.updateInterval >
      now
    ) {
      console.log('No need to update push notifications now');
      return;
    }

    if (states.lastPushNotificationUpdate.timestamp === 0) {
      console.log('There is no last push notification update');
      states.lastPushNotificationUpdate.timestamp =
        states.serverTimestamp.value;
    }

    const serverPushNotifications = await swashApiHelper.getPushNotifications(
      await userHelper.generateJWT(),
      states.lastPushNotificationUpdate.timestamp,
    );

    if (serverPushNotifications.length > 0) {
      const profile = await storageHelper.getProfile();
      const { inApp, push } = await storageHelper.getNotifications();
      serverPushNotifications.forEach((item) => {
        if (item.condition !== '') {
          try {
            const conditions = JSON.parse(item.condition);

            for (const key of Object.keys(conditions)) {
              if (Object.keys(profile).includes(key)) {
                if (Array.isArray(conditions[key])) {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  if (!conditions[key].includes(profile[key])) {
                    return;
                  }
                } else {
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  if (conditions[key] !== profile[key]) {
                    return;
                  }
                }
              }
            }
          } catch (e) {
            return;
          }
        }
        push.push(item);
      });
      storageHelper.saveNotifications({ inApp, push }).catch(console.error);
    }

    states.lastPushNotificationUpdate.timestamp = states.serverTimestamp.value;
    states.lastPushNotificationUpdate.check = now;
    storageHelper.saveStates(states).catch(console.error);
  }

  return {
    init,
    setupJobs,
  };
})();

export { notificationHelper };
