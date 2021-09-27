import { ethers } from 'ethers';
import browser from 'webextension-polyfill';

import { Any } from '../types/any.type';
import { SwashApiConfigs } from '../types/storage/configs/swash-api.type';

import { communityHelper } from './communityHelper';
import { configManager } from './configManager';
import { storageHelper } from './storageHelper';

const swashApiHelper = (function () {
  let APIConfigManager: SwashApiConfigs;
  function init() {
    APIConfigManager = configManager.getConfig('swashAPI');
  }

  async function callSwashAPIData(
    api: string,
    method = 'GET',
    body: Any = undefined,
  ) {
    const token = await communityHelper.generateJWT();
    if (!token) return;
    const url = APIConfigManager.endpoint + api;
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

  async function isJoinedSwash() {
    const data = await callSwashAPIData(APIConfigManager.APIs.userJoin);
    if (data.id) {
      await updateUserId(data.id);
      return true;
    }
    return false;
  }

  async function joinSwash() {
    const token = await communityHelper.generateJWT();
    if (!token) return;
    browser.tabs
      .create({
        url: 'https://swashapp.io/user/join?token='.concat(token),
      })
      .then();
  }

  async function getReferralRewards() {
    const data = await callSwashAPIData(
      APIConfigManager.APIs.userReferralReward,
    );
    if (data.reward) {
      return ethers.utils.formatEther(data.reward);
    }
    return '0';
  }

  async function getWithdrawBalance() {
    const data = await callSwashAPIData(APIConfigManager.APIs.balanceWithdraw);
    const result = { minimum: 1000000, gas: 10000 };

    if (data.sponsor && data.sponsor.minimum) {
      result.minimum = Number(ethers.utils.formatEther(data.sponsor.minimum));
    }
    if (data.gas && data.gas.etherEquivalent) {
      result.gas = Number(ethers.utils.formatEther(data.gas.etherEquivalent));
    }
    return result;
  }

  async function withdrawToTarget(
    recipient: string,
    amount: string,
    useSponsor: boolean,
    sendToMainnet: boolean,
  ) {
    const signature = await communityHelper.signWithdrawAllTo(recipient);
    if (typeof signature === 'string') {
      const amountInWei = ethers.utils.parseEther(amount);
      const body = {
        recipient: recipient,
        signature: signature,
        amount: amountInWei.toString(),
        useSponsor: useSponsor,
        sendToMainnet: sendToMainnet,
      };
      const data = await callSwashAPIData(
        APIConfigManager.APIs.userBalanceWithdraw,
        'POST',
        body,
      );
      if (data.tx) return data;
      else if (data.message) {
        return communityHelper.transportMessage(data.message);
      }
      return data;
    }
    return signature;
  }

  async function claimRewards() {
    return await callSwashAPIData(
      APIConfigManager.APIs.userReferralClaim,
      'POST',
    );
  }

  async function getActiveReferral() {
    return await callSwashAPIData(APIConfigManager.APIs.referralActive);
  }

  async function ip2Location() {
    const data = await callSwashAPIData(APIConfigManager.APIs.ipLookup);
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

  async function getUserId() {
    const profile = await storageHelper.getProfile();
    if (profile.user_id) return profile.user_id;
    return -1;
  }

  async function updateUserId(user_id: number) {
    const profile = await storageHelper.getProfile();
    if (profile.user_id == null || profile.user_id !== user_id) {
      profile.user_id = user_id;
      await storageHelper.saveProfile(profile);
    }
  }

  async function getUserCountry() {
    const profile = await storageHelper.getProfile();
    if (profile.country) {
      return { country: profile.country, city: profile.city };
    }

    try {
      const { country, city } = await ip2Location();
      if (country !== '') {
        profile.country = country;
        profile.city = city;
        await storageHelper.saveProfile(profile);
        return country;
      }
    } catch (err) {
      console.log(err.message);
    }
    return 'Unknown';
  }

  return {
    joinSwash,
    isJoinedSwash,
    getReferralRewards,
    getActiveReferral,
    withdrawToTarget,
    claimRewards,
    getWithdrawBalance,
    getDataEthPairPrice,
    getUserId,
    getUserCountry,
    init,
  };
})();

export { swashApiHelper };
