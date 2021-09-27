import browser from 'webextension-polyfill';

import { Runtime } from 'webextension-polyfill/namespaces/runtime';

import { communityHelper } from './core/communityHelper';
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
import { Any } from './types/any.type';
import { browserUtils } from './utils/browser.util';
import { privacyUtils } from './utils/privacy.util';

import MessageSender = Runtime.MessageSender;
import OnInstalledDetailsType = Runtime.OnInstalledDetailsType;

let isConfigReady = false;
let tryCount = 0;

function initConfigs() {
  memberManager.init();
  dataHandler.init();
  communityHelper.init();
  onboarding.init();
  apiCall.init();
  swashApiHelper.init();
  loader.initConfs();
}

async function installSwash(info: OnInstalledDetailsType) {
  console.log('Start installing...');
  if (!isConfigReady) {
    console.log(
      'Configuration files is not ready yet, will try install it later',
    );
    if (tryCount < 120) {
      setTimeout(() => installSwash(info), 1000);
      tryCount++;
      return;
    }
    console.log(
      "Configuration files couldn't be loaded successfully. Installation aborted",
    );
    return;
  }
  tryCount = 0;

  await configManager.importAll();
  initConfigs();
  if (info.reason === 'update' || info.reason === 'install') {
    await loader.createDBIfNotExist();
    const isNeeded = await onboarding.isNeededOnBoarding();
    if (isNeeded) {
      onboarding.openOnBoarding();
    } else {
      await loader.install();
      await loader.onInstalled();
    }
  }
}

/* ***
	This function will invoke on:
	1. update firefox
	2. install add-on
	3. update add-on
*/
browser.runtime.onInstalled.addListener(installSwash);

browserUtils.isMobileDevice().then((res) => {
  if (res) {
    browser.browserAction.onClicked.addListener(async () =>
      browser.tabs.create({ url: '/dashboard/index.html#/Settings' }),
    );
  } else {
    browser.browserAction.setPopup({ popup: 'popup/popup.html' }).then();
  }
});

configManager.loadAll().then(async () => {
  console.log('Start loading...');

  //Now the configuration is avaliable
  initConfigs();
  isConfigReady = true;

  /* Set popup menu for desktop versions */

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
        communityHelper: communityHelper,
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

  /* ***
	If UI has changed a config in data storage, a reload should be performed.
	UI will modify data storage directly.
	*/
  //browser.storage.onChanged.addListener(loader.reload);

  /* ***
	After a successful load of add-on,
	the main loop will start.
	*/
  storageHelper.getConfigs().then((confs) => {
    if (confs) {
      loader.onInstalled();
    }
  });
});