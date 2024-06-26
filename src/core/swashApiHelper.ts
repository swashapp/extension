import { formatEther } from '@ethersproject/units';

import Browser from 'webextension-polyfill';

import { Any } from '../types/any.type';
import { SwashApiConfigs } from '../types/storage/configs/swash-api.type';

import {
  ClaimRewardResponse,
  JoinResponse,
  LocationResponse,
  MinimumWithdrawResponse,
  ReferralRewardResponse,
  WithdrawResponse,
  ReferralsResponse,
  InAppNotificationsResponse,
  LatestPrograms,
  PushNotificationsResponse,
} from '../types/swash-api.type';

import { configManager } from './configManager';

const OK_STATUS = 200;

function encodeQueryString(params: {
  [key: string]: string | boolean | number;
}) {
  return Object.keys(params)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');
}

function createRequest(token: string, method = 'GET') {
  return {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Swash-Extension': `v${Browser.runtime.getManifest().version}`,
      Authorization: `Bearer ${token}`,
    },
  };
}

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

  async function call<Type>(url: string, req: Any) {
    let message = '';

    try {
      const resp = await fetch(url, req);
      const payload = await resp.json();
      if (payload.status === 'success') return payload.data as Type;
      if (payload.status === 'error') message = payload.message;
    } catch (err) {
      throw Error(`Failed to fetch ${url}`);
    }

    throw Error(message);
  }

  async function get<Type>(token: string, api: string, params?: Any) {
    const query = params ? `?${encodeQueryString(params)}` : '';
    const url = api.startsWith('htt')
      ? api + query
      : config.endpoint + api + query;
    return call<Type>(url, createRequest(token));
  }

  async function post<Type>(token: string, api: string, body?: Any) {
    let req: Any = createRequest(token, 'POST');
    const url = config.endpoint + api;
    if (body) req = { ...req, body: JSON.stringify(body) };
    return call<Type>(url, req);
  }

  async function put<Type>(token: string, api: string, body?: Any) {
    let req: Any = createRequest(token, 'PUT');
    const url = config.endpoint + api;
    if (body) req = { ...req, body: JSON.stringify(body) };
    return call<Type>(url, req);
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

  async function getLatestPrograms(token: string) {
    return get<LatestPrograms>(token, config.APIs.latestPrograms);
  }

  async function getJoinedSwash(token: string) {
    return get<JoinResponse>(token, config.APIs.userJoin);
  }

  async function getReferralRewards(token: string) {
    return get<ReferralRewardResponse>(token, config.APIs.userReferralReward);
  }

  async function getReferrals(token: string) {
    return get<ReferralsResponse>(token, config.APIs.userReferralReward, {
      details: true,
    });
  }

  async function resendCodeToEmail(token: string, body: Any) {
    return put<Any>(token, config.APIs.emailVerification, body);
  }

  async function join(token: string, body: Any) {
    return post<JoinResponse>(token, config.APIs.userJoin, body);
  }

  async function newsletterSignUp(email: string, newsletter: number) {
    return post<Any>('', config.APIs.newsletterSignUp, { email, newsletter });
  }

  async function getInAppNotifications(token: string) {
    return get<InAppNotificationsResponse[]>(
      token,
      config.APIs.inAppNotifications,
      {
        device: 'extension',
      },
    );
  }

  async function getPushNotifications(token: string, timestamp: number) {
    return get<PushNotificationsResponse[]>(
      token,
      config.APIs.pushNotifications,
      {
        device: 'extension',
        timestamp,
      },
    );
  }

  async function getWithdrawBalance(token: string) {
    const data = await get<MinimumWithdrawResponse>(
      token,
      config.APIs.balanceWithdraw,
    );
    const result = { minimum: 1000000, gas: 10000 };

    if (data.sponsor && data.sponsor.minimum) {
      result.minimum = Number(formatEther(data.sponsor.minimum));
    }
    if (data.gas && data.gas.etherEquivalent) {
      result.gas = Number(formatEther(data.gas.etherEquivalent));
    }

    return result;
  }

  async function getIpLocation(token: string) {
    return get<LocationResponse>(token, config.APIs.ipLookup);
  }

  async function userWithdraw(token: string, body: Any) {
    return await post<WithdrawResponse>(
      token,
      config.APIs.userBalanceWithdraw,
      body,
    );
  }

  async function userDonate(token: string, body: Any) {
    return await post<WithdrawResponse>(
      token,
      config.APIs.userDonateCharity,
      body,
    );
  }

  async function claimRewards(token: string) {
    return await post<ClaimRewardResponse>(
      token,
      config.APIs.userReferralClaim,
    );
  }

  async function getVerifiedInfo(token: string) {
    return get<Any>(token, config.APIs.userVerifiedInfo);
  }

  async function updateVerifiedInfo(token: string, body: Any) {
    return post<Any>(token, config.APIs.userVerifiedInfo, body);
  }

  async function getAdditionalInfo(token: string) {
    return get<Any>(token, config.APIs.userAdditionalInfo);
  }

  async function updateAdditionalInfo(token: string, body: Any) {
    return post<Any>(token, config.APIs.userAdditionalInfo, body);
  }

  async function getCharities(token: string) {
    return get<Any>(token, config.APIs.charityList);
  }

  async function getSurveyUrl(token: string, provider: string) {
    return get<Any>(token, config.APIs.surveyUrl, { provider });
  }

  async function getSurveyHistory(
    token: string,
    params: { [key: string]: string | number },
  ) {
    return get<Any>(token, config.APIs.surveyHistory, { ...params });
  }

  async function getOfferUrl(token: string, provider: string, offerId: string) {
    return get<Any>(token, config.APIs.offerUrl, { provider, offerId });
  }

  return {
    init,
    getDataEthPairPrice,
    getTimestamp,
    getLatestPrograms,
    getJoinedSwash,
    getReferralRewards,
    getReferrals,
    getWithdrawBalance,
    getIpLocation,
    userWithdraw,
    userDonate,
    claimRewards,
    resendCodeToEmail,
    join,
    newsletterSignUp,
    getInAppNotifications,
    getPushNotifications,
    getVerifiedInfo,
    updateVerifiedInfo,
    getAdditionalInfo,
    updateAdditionalInfo,
    getCharities,
    getSurveyUrl,
    getSurveyHistory,
    getOfferUrl,
  };
})();

export { swashApiHelper };
