import { userHelper } from './userHelper';

const sAdsHelper = (function () {
  let reg = {};

  async function init() {
    return;
  }

  async function joinServer() {
    const resp = await fetch('https://app.swashapp.io/auth/swash-register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: userHelper.getWalletAddress(),
      }),
    });

    if (resp.status === 200) {
      reg = await resp.json();
    } else throw new Error('Can not register user on swash sAds');
  }

  async function getAdsSlots() {
    if (Object.keys(reg).length === 0) await joinServer();
    console.log(`sAdId Reg:`);
    console.log(reg);
    return reg;
  }

  return {
    init,
    joinServer,
    getAdsSlots,
  };
})();

export { sAdsHelper };
