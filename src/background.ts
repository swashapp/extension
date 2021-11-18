import browser from 'webextension-polyfill';

import { configManager } from './core/configManager';
import { databaseHelper } from './core/databaseHelper';
import { dataHandler } from './core/dataHandler';
import { apiCall } from './core/functions/apiCall';
import { content } from './core/functions/content';
import { context } from './core/functions/context';
import { task } from './core/functions/task';
import { transfer } from './core/functions/transfer';
import { loader } from './core/loader';
import { memberManager } from './core/memberManager';
import { onboarding } from './core/onboarding';
import { pageAction } from './core/pageAction';
import { storageHelper } from './core/storageHelper';
import { swashApiHelper } from './core/swashApiHelper';
import { userHelper } from './core/userHelper';
import { Any } from './types/any.type';
import { browserUtils } from './utils/browser.util';
import { privacyUtils } from './utils/privacy.util';

async function initConfigs() {
  await memberManager.init();
  await dataHandler.init();
  await userHelper.init();
  await onboarding.init();
  await apiCall.init();
  await swashApiHelper.init();
}

async function installSwash(info: Any) {
  console.log('Start installing...');
  await initConfigs();
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
  await initConfigs();

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
    browser.browserAction.setPopup({ popup: 'popup/popup.html' }).then();
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
      configManager: configManager,
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sendResponse(objList[message.obj][message.func](...message.params));
  },
);
