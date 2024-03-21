import { RequestMethod } from "@/enums/api.enum";
import { API_GATEWAY } from "@/paths";
import { UserServicesConfiguration } from "@/types/storage/configuration.type";

export const UserApi: UserServicesConfiguration = {
  base: API_GATEWAY,
  timeout: 30000,

  v2_contract_address: "0x15287E573007d5FbD65D87ed46c62Cf4C71Dd66d",
  v3_vault_address: "0x11720DacC6A1DC710865343249d15777D066fF3b",

  sync: {
    method: RequestMethod.GET,
    path: "/sync/v1/public/timestamp",
    cache: {
      ttl: 540000,
    },
  },
  init_verify: {
    method: RequestMethod.POST,
    path: "/user/v3/auth/verification/desktop",
  },
  reset_verify: {
    method: RequestMethod.PUT,
    path: "/user/v3/auth/verification/request",
  },
  register: {
    method: RequestMethod.POST,
    path: "/user/v3/auth/account/register",
    cache: {
      key: "account",
      ttl: 3600000,
    },
  },
  get_encrypted_data: {
    method: RequestMethod.GET,
    path: "/user/v3/auth/account/encrypted-data",
  },
  login: {
    method: RequestMethod.POST,
    path: "/user/v3/auth/account/login",
  },
  reset_account: {
    method: RequestMethod.POST,
    path: "/user/v3/auth/account/reset-password",
  },
  reset_password: {
    method: RequestMethod.POST,
    path: "/user/v3/auth/account/reset-password",
  },
  reset_wallet: {
    method: RequestMethod.POST,
    path: "/user/v3/auth/account/reset-wallet",
  },
  get_migration: {
    method: RequestMethod.GET,
    path: "/user/v3/auth/account/migration",
  },
  migrate: {
    method: RequestMethod.POST,
    path: "/user/v3/auth/account/migrate",
  },
  merge: {
    method: RequestMethod.POST,
    path: "/user/v3/auth/account/merge",
    purge: {
      keys: ["account", "info", "merge", "balance"],
    },
  },
  get_merge_history: {
    method: RequestMethod.GET,
    path: "/user/v3/auth/account/merge/history",
    cache: {
      key: "merge",
      ttl: 3600000,
    },
  },
  get_account_details: {
    method: RequestMethod.GET,
    path: "/user/v3/auth/account/details",
    cache: {
      key: "account",
      ttl: 3600000,
    },
  },
  update_verified_info: {
    method: RequestMethod.POST,
    path: "/user/v3/auth/info/verified",
    purge: {
      keys: ["account"],
    },
  },
  get_available_additional_info: {
    method: RequestMethod.GET,
    path: "/user/v3/auth/info/available",
    cache: {
      ttl: 86400000,
    },
  },
  update_additional_info: {
    method: RequestMethod.POST,
    path: "/user/v3/auth/info/additional",
    purge: {
      keys: ["info"],
    },
  },
  get_additional_info: {
    method: RequestMethod.GET,
    path: "/user/v3/auth/info/additional",
    cache: {
      key: "info",
      ttl: 86400000,
    },
  },
  get_referral_summary: {
    method: RequestMethod.GET,
    path: "/user/v3/auth/referral",
    cache: {
      key: "summary",
      ttl: 1800000,
    },
  },
  get_referral_links: {
    method: RequestMethod.GET,
    path: "/user/v3/auth/referral/links",
    cache: {
      key: "referral",
      ttl: 1800000,
    },
  },
  add_referral_link: {
    method: RequestMethod.POST,
    path: "/user/v3/auth/referral/link",
    purge: {
      keys: ["summary", "referral"],
    },
  },
  set_default_referral_link: {
    method: RequestMethod.POST,
    path: "/user/v3/auth/referral/link/default",
    purge: {
      keys: ["summary", "referral"],
    },
  },
  get_available_donations: {
    method: RequestMethod.GET,
    path: "/user/v3/auth/donation/available",
    cache: {
      key: "charity",
      ttl: 86400000,
    },
  },
  get_ongoing_donations: {
    method: RequestMethod.GET,
    path: "/user/v3/auth/donation/ongoings",
    cache: {
      key: "donation",
      ttl: 1800000,
    },
  },
  add_ongoing_donation: {
    method: RequestMethod.POST,
    path: "/user/v3/auth/donation/ongoing",
    purge: {
      keys: ["donation"],
    },
  },
  remove_ongoing_donation: {
    method: RequestMethod.DELETE,
    path: "/user/v3/auth/donation/ongoing",
    purge: {
      keys: ["donation"],
    },
  },
  get_app_config: {
    method: RequestMethod.GET,
    path: "/user/v3/public/app/config",
    cache: {
      key: "config",
      ttl: 86400000,
    },
  },
};
