import { ethers } from 'ethers';

import { Any } from '../types/any.type';
import { SwashApiConfigs } from '../types/storage/configs/swash-api.type';

import {
  ActiveReferralResponse,
  ClaimRewardResponse,
  JoinResponse,
  LocationResponse,
  MinimumWithdrawResponse,
  ReferralRewardResponse,
  WithdrawResponse,
} from '../types/swash-api.type';

import { configManager } from './configManager';

const OK_STATUS = 200;

const swashApiHelper = (function () {
  let config: SwashApiConfigs;

  async function init() {
    config = await configManager.getConfig('swashAPI');
  }

  async function getDataEthPairPrice() {
    const resp = await fetch(
      'https://api.binance.com/api/v3/ticker/price?symbol=DATAETH',
      {
        method: 'GET',
      },
    );

    if (resp.status === OK_STATUS) {
      return (await resp.json()).price;
    }
    throw new Error('Unable to fetch DATA price');
  }

  async function call<Type>(
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
        Authorization: `Bearer ${token}`,
      },
    };

    if (body) req = { ...req, body: JSON.stringify(body) };
    const resp = await fetch(url, req);

    if (resp.status === OK_STATUS) {
      const payload = await resp.json();
      if (payload.status === 'success') return payload.data as Type;
      throw Error(payload.message);
    }
    throw Error(`Failed to fetch ${api}`);
  }

  async function getTimestamp() {
    const resp = await fetch(config.endpoint + config.APIs.syncTimestamp, {
      method: 'GET',
    });
    if (resp.status === OK_STATUS) {
      return (await resp.json()).timestamp;
    }
    throw Error('Could not update timestamp');
  }

  async function getActiveReferral(token: string) {
    return call<ActiveReferralResponse>(token, config.APIs.referralActive);
  }

  async function getJoinedSwash(token: string) {
    return call<JoinResponse>(token, config.APIs.userJoin);
  }

  async function getReferralRewards(token: string) {
    return call<ReferralRewardResponse>(token, config.APIs.userReferralReward);
  }

  async function getWithdrawBalance(token: string) {
    const data = await call<MinimumWithdrawResponse>(
      token,
      config.APIs.balanceWithdraw,
    );
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
    return call<LocationResponse>(token, config.APIs.ipLookup);
  }

  async function userWithdraw(token: string, body: Any) {
    return await call<WithdrawResponse>(
      token,
      config.APIs.userBalanceWithdraw,
      'POST',
      body,
    );
  }

  async function claimRewards() {
    return await call<ClaimRewardResponse>(
      config.APIs.userReferralClaim,
      'POST',
    );
  }

  return {
    init,
    getDataEthPairPrice,
    getTimestamp,
    getActiveReferral,
    getJoinedSwash,
    getReferralRewards,
    getWithdrawBalance,
    getIpLocation,
    userWithdraw,
    claimRewards,
  };
})();

export { swashApiHelper };
