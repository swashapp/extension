import { AccountInfoRes } from "@/types/api/account.type";
import { GetAdditionalInfoRes } from "@/types/api/info.type";
import { GetIpLocationRes } from "@/types/api/ip.type";
import { CacheStorage, TimeBasedCache } from "@/types/storage/cache.type";
import { uuid } from "@/utils/id.util";

export const InitialAccountInfoRes = {
  email: "",
  phone: "",
  user_id: "",
  wallet: "",
  is_verified: false,
  is_active: false,
  last_activity: 0,
};

export const InitialAdditionalInfoRes = {
  birth: "",
  gender: "",
  marital: "",
  household: "",
  employment: "",
  income: "",
  industry: "",
};

export const InitialCache: CacheStorage = {
  device_key: uuid(),
  data: {
    account: new TimeBasedCache<AccountInfoRes>(InitialAccountInfoRes, 0),
    info: new TimeBasedCache<GetAdditionalInfoRes>(InitialAdditionalInfoRes, 0),
    location: new TimeBasedCache<GetIpLocationRes>(
      {
        city: "unknown",
        country_name: "unknown",
        country_code: "na",
      },
      0,
    ),
    charity: new TimeBasedCache([], 0),
  },
  session: {},
};
