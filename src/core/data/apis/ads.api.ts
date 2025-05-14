import { RequestMethod } from "@/enums/api.enum";
import { ADS_GATEWAY } from "@/paths";
import { AdsServicesConfiguration } from "@/types/storage/configuration.type";

export const AdsApi: AdsServicesConfiguration = {
  base: ADS_GATEWAY,
  timeout: 30000,
  token_ttl: 60000,
  use_ad_server: false,

  register: {
    method: RequestMethod.POST,
    path: "/auth/foreign/register",
    cache: {
      ttl: 2592000,
    },
  },
  supply_register: {
    method: RequestMethod.GET,
    path: "/supply/register",
  },
  supply_find: {
    method: RequestMethod.POST,
    path: "/supply/find",
    cache: {
      ttl: 30000,
    },
  },
};
