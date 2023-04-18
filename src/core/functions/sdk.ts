// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import browser from 'webextension-polyfill';

import { storageHelper } from '../storageHelper';
import { userHelper } from '../userHelper';

const sdk = (function () {
  async function initModule() {}

  function load() {
    console.log('aaaaa');
    if (!browser.tabs.onUpdated.hasListener(registerSwashSdk))
      browser.tabs.onUpdated.addListener(registerSwashSdk);
  }

  function unload() {
    if (browser.tabs.onUpdated.hasListener(registerSwashSdk))
      browser.tabs.onUpdated.removeListener(registerSwashSdk);
  }

  function loadModule() {
    load();
  }

  function unloadModule() {
    unload();
  }

  async function registerSwashSdk(tabId, changeInfo) {
    if (!(await userHelper.isVerified())) return;

    if (changeInfo.status == 'loading') {
      browser.tabs
        .executeScript(tabId, {
          file: '/lib/browser-polyfill.js',
          allFrames: false,
          runAt: 'document_start',
        })
        .then((result) => {
          browser.tabs
            .executeScript(tabId, {
              file: '/core/content_scripts/sdk_script.js',
              allFrames: false,
              runAt: 'document_end',
            })
            .then();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  async function getUserProfile() {
    const {
      user_id,
      gender,
      birth,
      age,
      income,
      country,
      city,
      marital,
      household,
      employment,
      industry,
    } = await storageHelper.getProfile();

    return {
      user_id,
      gender,
      birth,
      age,
      income,
      country,
      city,
      marital,
      household,
      employment,
      industry,
    };
  }

  return {
    initModule,
    load,
    unload,
    loadModule,
    unloadModule,
    getUserProfile,
  };
})();
export { sdk };
