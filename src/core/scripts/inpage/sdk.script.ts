import { OtherHandler } from "@/enums/handler.enum";
import { Any } from "@/types/any.type";
import { AccountInfoRes } from "@/types/api/account.type";
import { EarnHistoryRes, HistoryTableRes } from "@/types/api/history.type";
import { GetAdditionalInfoRes } from "@/types/api/info.type";
import { GetIpLocationRes } from "@/types/api/ip.type";
import { HelperMessage } from "@/types/app.type";
import { SdkMessageEvent } from "@/types/handler/sdk.type";
import { getAge } from "@/utils/date.util";

const execute = async function (data: HelperMessage) {
  return new Promise((resolve, reject) => {
    const listener = function (event: SdkMessageEvent) {
      if (event.data.func !== `${data.func}Resp`) return;

      window.removeEventListener("message", listener);
      if (event.data.response?.error) reject(event.data.response.error);
      else resolve(event.data.response);
    };

    window.addEventListener("message", listener);
    window.postMessage(data, "*");
  });
};

(window as Any).swashSdk = {
  version: 1,

  getStatus: async () => {
    const enabled = (await execute({
      obj: "coordinator",
      func: "get",
      params: ["isActive"],
    })) as boolean;

    return { enabled, verified: true };
  },
  getUserInfo: async () => {
    const { user_id } = (await execute({
      obj: "user",
      func: "getAccountDetails",
      params: [],
    })) as AccountInfoRes;
    const { city, country_name: country } = (await execute({
      obj: "cache",
      func: "get",
      params: ["location"],
    })) as GetIpLocationRes;
    const info = (await execute({
      obj: "user",
      func: "getAdditionalInfo",
      params: [],
    })) as GetAdditionalInfoRes;

    return {
      user_id,
      country,
      city,
      age: getAge(+info.birth),
      ...info,
    };
  },
  getOfferUrl: async (provider: string, offerId: string) => {
    return execute({
      obj: "earn",
      func: "getOfferUrl",
      params: [provider, offerId],
    });
  },
  getOfferWallUrl: async (provider: string) => {
    return execute({
      obj: "earn",
      func: "getOfferWallUrl",
      params: [provider],
    });
  },
  getEarnHistory: async (params: Any) => {
    const { data, total } = (await execute({
      obj: "earn",
      func: "getEarnHistory",
      params: [params],
    })) as HistoryTableRes<EarnHistoryRes>;

    return { list: data, total };
  },
  openPopupPage: async () => {
    return execute({
      obj: "page",
      func: OtherHandler.SDK,
      params: ["openPopupPage"],
    });
  },
  openProfilePage: async () => {
    return execute({
      obj: "page",
      func: OtherHandler.SDK,
      params: ["openProfilePage"],
    });
  },
  getVersion: async () => {
    return execute({
      obj: "page",
      func: OtherHandler.SDK,
      params: ["getVersion"],
    });
  },
};
