import { AdsTypeStatus } from '../types/storage/ads-config.type';

import { storageHelper } from './storageHelper';
import { userHelper } from './userHelper';

const adsHelper = (function () {
  let info: {
    foreignId: string;
    zones: { name: string; width: string; height: string; uuid: string }[];
  } = { foreignId: '', zones: [] };

  async function init() {
    return;
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
    db.status = { ...db.status, ...config };
    await storageHelper.saveAdsConfig(db);
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
