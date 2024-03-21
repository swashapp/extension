import { RequestMethod } from "@/enums/api.enum";
import { API_GATEWAY } from "@/paths";
import { EarnServicesConfiguration } from "@/types/storage/configuration.type";

export const EarnApi: EarnServicesConfiguration = {
  base: API_GATEWAY,
  timeout: 30000,

  sync: {
    method: RequestMethod.GET,
    path: "/sync/v1/public/timestamp",
    cache: {
      ttl: 540000,
    },
  },
  get_offer_url: {
    method: RequestMethod.GET,
    path: "/earn/v1/auth/offer/url",
  },
  get_offer_wall_url: {
    method: RequestMethod.GET,
    path: "/earn/v1/auth/offer/wall/url",
  },
  get_history: {
    method: RequestMethod.GET,
    path: "/earn/v1/auth/earner/history",
    cache: {
      ttl: 30000,
    },
  },
};
