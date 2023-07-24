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

  let profileFlag = true;
  async function openProfilePage() {
    if (profileFlag) {
      profileFlag = false;
      const url = browser.runtime.getURL('dashboard/index.html#/profile');
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
      setTimeout(() => (profileFlag = true), 1000);
    }
  }

  let popupFlag = true;
  async function openPopupPage() {
    if (popupFlag) {
      popupFlag = false;
      const url = browser.runtime.getURL('popup/index.html');
      const windows = await browser.windows.getAll({
        populate: true,
        windowTypes: ['popup'],
      });
      const window = windows.find((item) => item.tabs[0].url === url);
      if (window) {
        window.focused = true;
        await browser.windows.update(window.id, { focused: true });
      } else {
        await browser.windows
          .create({
            url,
            type: 'popup',
            height: 450,
            width: 370,
            left: screen.width - 370,
            top: 0,
          })
          .then(async (w) => {
            await browser.windows.update(w.id, {
              drawAttention: true,
              focused: true,
              height: 450,
              width: 370,
              left: screen.width - 370,
              top: 0,
            });
          });
      }
      setTimeout(() => (popupFlag = true), 1000);
    }
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
