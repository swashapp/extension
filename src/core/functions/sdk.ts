// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import browser from 'webextension-polyfill';

import { storageHelper } from '../storageHelper';
import { userHelper } from '../userHelper';

const sdk = (function () {
  async function initModule() {}

  function load() {
    if (!browser.tabs.onUpdated.hasListener(registerSwashSdk))
      browser.tabs.onUpdated.addListener(registerSwashSdk);
  }

  function unload() {
    // if (browser.tabs.onUpdated.hasListener(registerSwashSdk))
    //   browser.tabs.onUpdated.removeListener(registerSwashSdk);
  }

  function loadModule() {
    load();
  }

  function unloadModule() {
    // unload();
  }

  async function registerSwashSdk(tabId, changeInfo) {
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

  async function getStatus() {
    const { is_enabled: enabled } = await storageHelper.getConfigs();
    const verified = await userHelper.isVerified();

    return { enabled, verified };
  }

  let flag = true;
  async function openPage(path: string) {
    if (flag) {
      flag = false;
      const url = browser.runtime.getURL(path);
      const tabs: browser.Tabs.Tab[] = await browser.tabs.query({
        currentWindow: true,
      });
      const tab = tabs.find((tab) => tab.url === url);
      if (tab) {
        tab.active = true;
        await browser.tabs.update(tab.id, { active: true });
      } else {
        await browser.tabs.create({ url, active: true });
      }
      setTimeout(() => (flag = true), 1000);
    }
  }

  async function openProfilePage() {
    openPage('dashboard/index.html#/profile');
  }

  async function openPopupPage() {
    openPage('popup/index.html');
  }

  async function getUserInfo() {
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

  async function getSurveyUrl(provider: string) {
    return userHelper.createSurveyUrl(provider);
  }

  async function getSurveyHistory(params: { [key: string]: string | number }) {
    return userHelper.getSurveyHistory(params);
  }

  return {
    initModule,
    load,
    unload,
    loadModule,
    unloadModule,
    getStatus,
    getUserInfo,
    getSurveyUrl,
    getSurveyHistory,
    openProfilePage,
    openPopupPage,
  };
})();
export { sdk };
