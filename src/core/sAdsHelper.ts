import { userHelper } from './userHelper';

const sAdsHelper = (function () {
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
      return item.width === `${width}` && item.height === `${height}`;
    });
    return { id: info.foreignId, uuid: found?.uuid };
  }

  return {
    init,
    joinServer,
    getAdsSlots,
  };
})();

export { sAdsHelper };
