// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { browserUtils } from './browserUtils';
import { communityHelper } from './communityHelper';
import { configManager } from './configManager';
import { databaseHelper } from './databaseHelper';
import { dataHandler } from './dataHandler';
import { apiCall } from './functions/apiCall';
import { content } from './functions/content';
import { context } from './functions/context';
import { task } from './functions/task';
import { transfer } from './functions/transfer';
import { loader } from './loader';
import { memberManager } from './memberManager';
import { onboarding } from './onboarding';
import { pageAction } from './pageAction';
import { privacyUtils } from './privacyUtils';
import { storageHelper } from './storageHelper';
import { swashApiHelper } from './swashApiHelper';

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

async function installSwash(info) {
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

browserUtils.getPlatformInfo().then((info) => {
  browserUtils.isMobileDevice().then((res) => {
    if (res) {
      browser.browserAction.onClicked.addListener(async () =>
        browser.tabs.create({ url: '/dashboard/index.html#/Settings' }),
      );
    } else {
      browser.browserAction.setPopup({ popup: 'popup/popup.html' });
    }
  });
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
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
    sendResponse(objList[message.obj][message.func](...message.params));
  });

  /* ***
	If UI has changed a config in data storage, a reload should be performed.
	UI will modify data storage directly.
	*/
  //browser.storage.onChanged.addListener(loader.reload);

  /* ***
	After a successful load of add-on,
	the main loop will start.
	*/
  storageHelper.retrieveConfigs().then((confs) => {
    if (confs) {
      loader.onInstalled();
    }
  });
});
