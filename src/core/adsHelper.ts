import browser, { Tabs } from 'webextension-polyfill';

import { AdsTypeStatus } from '../types/storage/ads-config.type';

import { storageHelper } from './storageHelper';
import { userHelper } from './userHelper';

const adsHelper = (function () {
  let info: {
    foreignId: string;
    zones: { name: string; width: string; height: string; uuid: string }[];
  } = { foreignId: '', zones: [] };

  async function init() {
    await updateFullScreenListener();
  }

  async function addNewTab(tab: Tabs.Tab) {
    if (
      tab.url === 'chrome://newtab/' ||
      tab.url === 'edge://newtab/' ||
      tab.url === 'about:newtab' ||
      tab.pendingUrl === 'chrome://newtab/' ||
      tab.pendingUrl === 'edge://newtab/' ||
      tab.pendingUrl === 'about:newtab'
    ) {
      await browser.tabs.update(tab.id, {
        url: browser.runtime.getURL('/new-tab/index.html'),
      });
    }
  }

  async function updateFullScreenListener() {
    const { fullScreen } = (await storageHelper.getAdsConfig()).status;

    if (fullScreen) browser.tabs.onCreated.addListener(addNewTab);
    else if (browser.tabs.onCreated.hasListener(addNewTab)) {
      browser.tabs.onCreated.removeListener(addNewTab);
    }
  }

  async function joinServer() {
    const resp = await fetch('https://app.swashapp.io/auth/foreign/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: userHelper.getWalletAddress(),
      }),
    });

    if (resp.status === 200) {
      info = await resp.json();
    } else throw new Error('Can not register user on swash sAds');
  }

  async function getAdsSlots(width: number, height: number) {
    const { is_enabled } = await storageHelper.getConfigs();
    if (!is_enabled || !(await userHelper.isVerified())) return;

    if (info.foreignId === '') await joinServer();
    const found = info.zones.find((item) => {
      return (
        item.width === width.toString() && item.height === height.toString()
      );
    });
    return { id: info.foreignId, uuid: found?.uuid };
  }

  async function updateAdsStatus(config: AdsTypeStatus) {
    if (!(await userHelper.isVerified())) return;

    const db = await storageHelper.getAdsConfig();
    const fullscreenChanged = db.status.fullScreen !== config.fullScreen;
    db.status = { ...db.status, ...config };
    await storageHelper.saveAdsConfig(db);

    if (fullscreenChanged) await updateFullScreenListener();
  }

  async function getAdsStatus() {
    return (await storageHelper.getAdsConfig()).status;
  }

  return {
    init,
    joinServer,
    getAdsSlots,
    updateAdsStatus,
    getAdsStatus,
  };
})();

export { adsHelper };
