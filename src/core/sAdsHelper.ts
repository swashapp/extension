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

  async function getAdsSlots(width: string, height: string) {
    if (info.foreignId === '') await joinServer();
    console.log(`ForeignID Reg: ${info.foreignId}`);
    const found = info.zones.find(
      (item) => item.width === width && item.height === height,
    );
    console.log(`Found Slot: ${found}`);
    return { id: info.foreignId, uuid: found?.uuid };
  }

  return {
    init,
    joinServer,
    getAdsSlots,
  };
})();

export { sAdsHelper };
