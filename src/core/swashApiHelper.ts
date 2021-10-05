import { ethers } from 'ethers';

import { Any } from '../types/any.type';
import { SwashApiConfigs } from '../types/storage/configs/swash-api.type';

import { configManager } from './configManager';

const swashApiHelper = (function () {
  let config: SwashApiConfigs;

  function init() {
    config = configManager.getConfig('swashAPI');
  }

  async function callSwashAPIData(
    token: string,
    api: string,
    method = 'GET',
    body?: Any,
  ) {
    const url = config.endpoint + api;
    let req: Any = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer '.concat(token),
      },
    };

    if (body) {
      req = { ...req, body: JSON.stringify(body) };
    }
    try {
      const resp = await fetch(url, req);
      const result = await resp.json();
      if (result.status === 'success') return result.data;
      else {
        console.log(result.message);
        return { reason: result.message };
      }
    } catch (err) {
      console.error(`Error message: ${err.message}`);
    }
    return {};
  }

  async function getTimestamp() {
    const resp = await fetch(config.endpoint + config.APIs.syncTimestamp, {
      method: 'GET',
    });
    if (resp.status === 200) {
      return (await resp.json()).timestamp;
    }
    throw Error('Could not update timestamp');
  }

  async function getActiveReferral(token: string) {
    return await callSwashAPIData(token, config.APIs.referralActive);
  }

  async function getJoinedSwash(token: string) {
    return callSwashAPIData(token, config.APIs.userJoin);
  }

  async function getReferralRewards(token: string) {
    const data = await callSwashAPIData(token, config.APIs.userReferralReward);
    if (data.reward) {
      return ethers.utils.formatEther(data.reward);
    }
    return '0';
  }

  async function getWithdrawBalance(token: string) {
    const data = await callSwashAPIData(token, config.APIs.balanceWithdraw);
    const result = { minimum: 1000000, gas: 10000 };

    if (data.sponsor && data.sponsor.minimum) {
      result.minimum = Number(ethers.utils.formatEther(data.sponsor.minimum));
    }
    if (data.gas && data.gas.etherEquivalent) {
      result.gas = Number(ethers.utils.formatEther(data.gas.etherEquivalent));
    }
    return result;
  }

  async function getIpLocation(token: string) {
    const data = await callSwashAPIData(token, config.APIs.ipLookup);
    if (data.country) {
      return { country: data.country, city: data.city };
    }
    throw 'Failed to fetch user country';
  }

  async function getDataEthPairPrice() {
    const url = 'https://api.binance.com/api/v3/ticker/price?symbol=DATAETH';
    const req = {
      method: 'GET',
    };
    try {
      const resp = await fetch(url, req);
      if (resp.status === 200) {
        const data = await resp.json();
        return data['price'];
      }
    } catch (err) {
      console.error(`Error message: ${err.message}`);
    }
    throw new Error('Unable to fetch DATA price');
  }

  async function userWithdraw(token: string, body: Any) {
    return await callSwashAPIData(
      token,
      config.APIs.userBalanceWithdraw,
      'POST',
      body,
    );
  }

  async function claimRewards() {
    return await callSwashAPIData(config.APIs.userReferralClaim, 'POST');
  }

  return {
    init,
    getTimestamp,
    getActiveReferral,
    getJoinedSwash,
    getReferralRewards,
    getWithdrawBalance,
    getDataEthPairPrice,
    getIpLocation,
    userWithdraw,
    claimRewards,
  };
})();

export { swashApiHelper };
