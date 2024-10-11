import browser, { Tabs } from 'webextension-polyfill';

import { WebsitePath } from '../paths';
import { AdsTypeStatus } from '../types/storage/ads-config.type';

import { browserUtils } from '../utils/browser.util';

import { storageHelper } from './storageHelper';
import { userHelper } from './userHelper';

const app = `https://app.swashapp.io`;

const adsHelper = (function () {
  let previousFullScreenAds: string[] = [];
  let isFullScreenAvailable = false;
  let info: {
    foreignId: string;
    zones: { name: string; width: string; height: string; uuid: string }[];
  } = { foreignId: '', zones: [] };

  async function init() {
    await updateFullScreenListener();

    setInterval(() => {
      previousFullScreenAds = [];
    }, 3600000);
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
      const isMobile = await browserUtils.isMobileDevice();

      if (isMobile) isFullScreenAvailable = false;
      else
        getAvailableAds(3840, 2160).then((id) => {
          if (previousFullScreenAds.includes(id) || id === '') {
            isFullScreenAvailable = false;
          } else {
            previousFullScreenAds.push(id);
            isFullScreenAvailable = true;
          }
        });

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
    const resp = await fetch(`${app}/auth/foreign/register`, {
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

  async function getAvailableAds(width: number, height: number) {
    function getRandId(bytes: number) {
      let d = new Date().getTime();

      const chars = [];
      for (let i = 0; i < bytes; i++) {
        const r = (d + Math.random() * 256) % 256 | 0;
        d = Math.floor(d / 256);
        chars.push(String.fromCharCode(r));
      }

      return chars.join('');
    }

    function UrlSafeBase64Encode(data: string) {
      return btoa(unescape(encodeURIComponent(data))).replace(
        /=|\+|\//g,
        function (x) {
          return x == '+' ? '-' : x == '/' ? '_' : '';
        },
      );
    }

    function getImpressionId() {
      return UrlSafeBase64Encode(getRandId(16));
    }

    try {
      const slot = await getAdsSlots(width, height);

      const impression = getImpressionId();
      await fetch(`${app}/supply/register?iid=${impression}`);

      const find = await fetch(`${app}/supply/find`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          context: {
            iid: impression,
            metamask: true,
            url: `${WebsitePath}/user/ads/view?id=${slot?.uuid}&w=${width}&h=${height}`,
          },
          placements: [
            {
              id: '0',
              placementId: slot?.uuid,
            },
          ],
        }),
      });

      const body = await find.json();
      return body.data[0].hash;
    } catch (err) {
      console.error(err);
    }
    return '';
  }

  function getIsFullScreenAvailable() {
    return isFullScreenAvailable;
  }

  async function getAdsSlots(width: number, height: number) {
    const { is_enabled } = await storageHelper.getConfigs();
    if (!is_enabled) return;

    if (info.foreignId === '') await joinServer();
    const found = info.zones.find((item) => {
      return (
        item.width === width.toString() && item.height === height.toString()
      );
    });
    return { id: info.foreignId, uuid: found?.uuid };
  }

  async function updateAdsStatus(config: AdsTypeStatus) {
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
    getIsFullScreenAvailable,
    getAdsSlots,
    updateAdsStatus,
    getAdsStatus,
  };
})();

export { adsHelper };
