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
    if (changeInfo.status == 'loading') {
      browser.scripting
        .executeScript({
          injectImmediately: true,
          target: { tabId, allFrames: false },
          files: [
            '/lib/browser-polyfill.js',
            '/core/content_scripts/sdk_script.js',
          ],
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  async function getVersion() {
    return browser.runtime.getManifest().version;
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
      const current = await browser.windows.getCurrent();
      const windows = await browser.windows.getAll({
        populate: true,
        windowTypes: ['popup'],
      });
      const window = windows.find((item) => item.tabs[0].url === url);
      if (window) {
        window.focused = true;
        await browser.windows.update(window.id, {
          drawAttention: true,
          focused: true,
        });
      } else {
        const width = 370;
        const height = 450;
        const top = current.top;
        const left =
          current.width -
          width +
          (current.left === 'fulfilled' ? 0 : current.left);
        await browser.windows
          .create({
            url,
            type: 'popup',
            height,
            width,
            left,
            top,
          })
          .then(async (w) => {
            await browser.windows.update(w.id, {
              drawAttention: true,
              focused: true,
              height,
              width,
              left,
              top,
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
    getVersion,
  };
})();
export { sdk };
