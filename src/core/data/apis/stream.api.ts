import { RequestMethod } from "@/enums/api.enum";
import { StreamCategoryLowered } from "@/enums/stream.enum";
import { STREAM_GATEWAY } from "@/paths";
import { StreamsServicesConfiguration } from "@/types/storage/configuration.type";

const base = {
  base: STREAM_GATEWAY,
  timeout: 30000,

  sync: {
    method: RequestMethod.GET,
    path: "/sync/v1/public/timestamp",
    cache: {
      ttl: 540000,
    },
  },
};

export const StreamApi: StreamsServicesConfiguration = {
  session_ttl: 600000,

  [StreamCategoryLowered.BEAUTY]: {
    ...base,
    publish: {
      method: RequestMethod.POST,
      path: `/extension/v1/auth/publish/${StreamCategoryLowered.BEAUTY}`,
    },
  },
  [StreamCategoryLowered.GENERAL]: {
    ...base,
    publish: {
      method: RequestMethod.POST,
      path: `/extension/v1/auth/publish/${StreamCategoryLowered.GENERAL}`,
    },
  },
  [StreamCategoryLowered.MUSIC]: {
    ...base,
    publish: {
      method: RequestMethod.POST,
      path: `/extension/v1/auth/publish/${StreamCategoryLowered.MUSIC}`,
    },
  },
  [StreamCategoryLowered.NEWS]: {
    ...base,
    publish: {
      method: RequestMethod.POST,
      path: `/extension/v1/auth/publish/${StreamCategoryLowered.NEWS}`,
    },
  },
  [StreamCategoryLowered.SEARCH]: {
    ...base,
    publish: {
      method: RequestMethod.POST,
      path: `/extension/v1/auth/publish/${StreamCategoryLowered.SEARCH}`,
    },
  },
  [StreamCategoryLowered.SHOPPING]: {
    ...base,
    publish: {
      method: RequestMethod.POST,
      path: `/extension/v1/auth/publish/${StreamCategoryLowered.SHOPPING}`,
    },
  },
  [StreamCategoryLowered.SOCIAL]: {
    ...base,
    publish: {
      method: RequestMethod.POST,
      path: `/extension/v1/auth/publish/${StreamCategoryLowered.SOCIAL}`,
    },
  },
};
