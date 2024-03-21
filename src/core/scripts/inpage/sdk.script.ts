import { Any } from '../../../types/any.type';
import { AccountInfoRes } from '../../../types/api/account.type';
import { GetAdditionalInfoRes } from '../../../types/api/info.type';
import { GetIpLocationRes } from '../../../types/api/ip.type';
import { HelperMessage } from '../../../types/app.type';
import { SdkMessageEvent } from '../../../types/handler/sdk.type';
import { getAge } from '../../../utils/date.util';

const execute = async function (data: HelperMessage) {
  return new Promise((resolve, reject) => {
    const listener = function (event: SdkMessageEvent) {
      if (event.data.func !== `${data.func}Resp`) return;

      window.removeEventListener('message', listener);
      if (event.data.response?.error) reject(event.data.response.error);
      else resolve(event.data.response);
    };

    window.addEventListener('message', listener);
    window.postMessage(data, '*');
  });
};

(window as Any).SwashSDK = {
  version: 1,

  getStatus: async () => {
    const enabled = (await execute({
      obj: 'coordinator',
      func: 'get',
      params: ['isActive'],
    })) as boolean;
    const { is_verified: verified } = (await execute({
      obj: 'cache',
      func: 'get',
      params: ['info'],
    })) as AccountInfoRes;

    return { enabled, verified };
  },
  getUserInfo: async () => {
    const { user_id } = (await execute({
      obj: 'cache',
      func: 'get',
      params: ['info'],
    })) as AccountInfoRes;
    const { city, country_name: country } = (await execute({
      obj: 'cache',
      func: 'get',
      params: ['location'],
    })) as GetIpLocationRes;
    const info = (await execute({
      obj: 'cache',
      func: 'get',
      params: ['profile'],
    })) as GetAdditionalInfoRes;

    return {
      user_id,
      country,
      city,
      age: getAge(+info.birth),
      ...info,
    };
  },
  getSurveyUrl: async (provider: string) => {
    return execute({ obj: 'earn', func: 'getSurveyUrl', params: [provider] });
  },
  getSurveyHistory: async (params: Any) => {
    return execute({ obj: 'earn', func: 'getSurveyHistory', params: [params] });
  },
  getOfferUrl: async (provider: string, offerId: string) => {
    return execute({
      obj: 'earn',
      func: 'getOfferUrl',
      params: [provider, offerId],
    });
  },
  openPopupPage: async () => {
    // return execute({ obj: 'sdk', func: 'openPopupPage', params: [] });
  },
  openProfilePage: async () => {
    // return execute({ obj: 'sdk', func: 'openProfilePage', params: [] });
  },
  getVersion: async () => {
    // return execute({ obj: 'sdk', func: 'getVersion', params: [] });
  },
};
