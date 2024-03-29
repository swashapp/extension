import browser from 'webextension-polyfill';

import { adsHelper } from '../core/adsHelper';
import { charityHelper } from '../core/charityHelper';
import { configManager } from '../core/configManager';
import { databaseHelper } from '../core/databaseHelper';
import { dataHandler } from '../core/dataHandler';
import { ads } from '../core/functions/ads';
import { ajax } from '../core/functions/ajax';
import { content } from '../core/functions/content';
import { sdk } from '../core/functions/sdk';
import { transfer } from '../core/functions/transfer';
import { graphApiHelper } from '../core/graphApiHelper';
import { loader } from '../core/loader';
import { newTabHelper } from '../core/newTabHelper';
import { notificationHelper } from '../core/notificationHelper';
import { onboarding } from '../core/onboarding';
import { pageAction } from '../core/pageAction';
import { storageHelper } from '../core/storageHelper';
import { swashApiHelper } from '../core/swashApiHelper';
import { userHelper } from '../core/userHelper';
import { Any } from '../types/any.type';
import { browserUtils } from '../utils/browser.util';
import { privacyUtils } from '../utils/privacy.util';

let initiated = false;

async function installSwash(info: Any) {
  console.log('Start installing...');

  await loader.initiateConfigs();

  if (info.reason === 'install') {
    await onboarding.openOnBoarding();
  } else if (info.reason === 'update') {
    await loader.install();
    if (await onboarding.isNeededOnBoarding()) {
      await onboarding.openOnBoarding();
    } else {
      await loader.onInstalled();
    }
  }
}

async function startupSwash() {
  if (initiated) return;

  console.log('Start loading...');

  await loader.initiateConfigs();
  if (await onboarding.isNeededOnBoarding()) {
    await onboarding.openOnBoarding();
  } else if (await storageHelper.getConfigs()) {
    await loader.onInstalled();
  }
  initiated = true;
}

/*
  This function will invoke on:
  1. extension install
  2. extension update
  3. browser update
*/
browser.runtime.onInstalled.addListener(installSwash);
browser.runtime.onStartup.addListener(startupSwash);

if (browserUtils.getManifestVersion() === 2) {
  browserUtils.isMobileDevice().then((res) => {
    if (res) {
      browser.browserAction.onClicked.addListener(async () =>
        browser.tabs.create({ url: '/dashboard/index.html#/settings' }),
      );
    } else {
      browser.browserAction.setPopup({ popup: 'popup/index.html' }).then();
    }
  });
}

/*
  Each content script, after successful injection on a page, will send a message to background script to request data.
  This part handles such requests.
*/
browser.runtime.onMessage.addListener(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async (message: Any, sender: MessageSender) => {
    await startupSwash();

    if (message.obj === 'dummy') return '';
    if (sender.tab) message.params.push(sender.tab.id);

    const objList = {
      content,
      ajax,
      ads,
      sdk,
      storageHelper,
      databaseHelper,
      privacyUtils,
      loader,
      dataHandler,
      userHelper,
      pageAction,
      transfer,
      onboarding,
      swashApiHelper,
      graphApiHelper,
      configManager,
      charityHelper,
      newTabHelper,
      adsHelper,
      notificationHelper,
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return objList[message.obj][message.func](...message.params);
  },
);
