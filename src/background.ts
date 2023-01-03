import browser, { Tabs } from 'webextension-polyfill';

import { charityHelper } from './core/charityHelper';
import { configManager } from './core/configManager';
import { databaseHelper } from './core/databaseHelper';
import { dataHandler } from './core/dataHandler';
import { apiCall } from './core/functions/apiCall';
import { content } from './core/functions/content';
import { context } from './core/functions/context';
import { task } from './core/functions/task';
import { transfer } from './core/functions/transfer';
import { graphApiHelper } from './core/graphApiHelper';
import { loader } from './core/loader';
import { onboarding } from './core/onboarding';
import { pageAction } from './core/pageAction';
import { sAdsHelper } from './core/sAdsHelper';
import { storageHelper } from './core/storageHelper';
import { swashApiHelper } from './core/swashApiHelper';
import { userHelper } from './core/userHelper';
import { Any } from './types/any.type';
import { browserUtils } from './utils/browser.util';
import { privacyUtils } from './utils/privacy.util';

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
  console.log('Start loading...');

  //Now the configuration is available
  await loader.initiateConfigs();
  /* ***
	After a successful load of add-on,
	the main loop will start.
	*/
  if (await onboarding.isNeededOnBoarding()) {
    await onboarding.openOnBoarding();
  } else if (await storageHelper.getConfigs()) {
    await loader.onInstalled();
  }
}

/* ***
	This function will invoke on:
	1. update firefox
	2. install add-on
	3. update add-on
*/
browser.runtime.onInstalled.addListener(installSwash);
browser.runtime.onStartup.addListener(startupSwash);

browserUtils.isMobileDevice().then((res) => {
  if (res) {
    browser.browserAction.onClicked.addListener(async () =>
      browser.tabs.create({ url: '/dashboard/index.html#/settings' }),
    );
  } else {
    browser.browserAction.setPopup({ popup: 'popup/index.html' }).then();
  }
});

/* ***
	Each content script, after successful injection on a page, will send a message to background script to request data.
	This part handles such requests.
	*/
browser.runtime.onMessage.addListener(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  (message: Any, sender: MessageSender, sendResponse: Any) => {
    if (sender.tab) message.params.push(sender.tab.id);
    const objList = {
      storageHelper: storageHelper,
      databaseHelper: databaseHelper,
      privacyUtils: privacyUtils,
      apiCall: apiCall,
      loader: loader,
      content: content,
      dataHandler: dataHandler,
      context: context,
      task: task,
      userHelper: userHelper,
      pageAction: pageAction,
      transfer: transfer,
      onboarding: onboarding,
      swashApiHelper: swashApiHelper,
      graphApiHelper: graphApiHelper,
      configManager: configManager,
      charityHelper: charityHelper,
      sAdsHelper: sAdsHelper,
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sendResponse(objList[message.obj][message.func](...message.params));
  },
);
