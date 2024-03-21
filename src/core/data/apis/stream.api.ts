import { RequestMethod } from "@/enums/api.enum";
import { StreamCategoryLowered } from "@/enums/stream.enum";
import { STREAM_GATEWAY } from "@/paths";
import { StreamsServicesConfiguration } from "@/types/storage/configuration.type";

const Base = {
  base: STREAM_GATEWAY,
  timeout: 30000,

  sync: {
    method: RequestMethod.GET,
    path: "/sync/v1/public/timestamp",
    cache: {
      ttl: 540000,
    },
  },
  publish: {
    method: RequestMethod.POST,
    path: "/extension/v1/auth/publish",
  },
};

export const StreamApi: StreamsServicesConfiguration = {
  [StreamCategoryLowered.BEAUTY]: Base,
  [StreamCategoryLowered.GENERAL]: Base,
  [StreamCategoryLowered.MUSIC]: Base,
  [StreamCategoryLowered.NEWS]: Base,
  [StreamCategoryLowered.SEARCH]: Base,
  [StreamCategoryLowered.SHOPPING]: Base,
  [StreamCategoryLowered.SOCIAL]: Base,
};
