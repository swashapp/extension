import { RequestMethod } from "@/enums/api.enum";
import { API_GATEWAY } from "@/paths";
import { PaymentServicesConfiguration } from "@/types/storage/configuration.type";

export const PaymentApi: PaymentServicesConfiguration = {
  base: API_GATEWAY,
  timeout: 30000,

  sync: {
    method: RequestMethod.GET,
    path: "/sync/v1/public/timestamp",
    cache: {
      ttl: 540000,
    },
  },
  get_balance: {
    method: RequestMethod.GET,
    path: "/payment/v1/auth/balance/balance",
    cache: {
      key: "balance",
      ttl: "0 0 * * *",
      volatile: true,
    },
  },
  get_payment_history: {
    method: RequestMethod.GET,
    path: "/payment/v1/auth/payment/history",
    cache: {
      ttl: 3600000,
    },
  },
  get_withdraw_info: {
    method: RequestMethod.GET,
    path: "/payment/v1/auth/withdraw/info",
    cache: {
      ttl: 300000,
    },
  },
  withdraw_by_crypto: {
    method: RequestMethod.POST,
    path: "/payment/v1/auth/withdraw",
    purge: {
      keys: ["balance"],
    },
  },
  withdraw_by_gift_card: {
    method: RequestMethod.POST,
    path: "/payment/v1/auth/gift-card/link",
    timeout: 120000,
    purge: {
      keys: ["balance", "voucher"],
    },
  },
  withdraw_by_voucher: {
    method: RequestMethod.POST,
    path: "/payment/v1/auth/gift-card/link-with-voucher",
    timeout: 120000,
    purge: {
      keys: ["balance", "voucher"],
    },
  },
  get_verify_threshold: {
    method: RequestMethod.GET,
    path: "/payment/v1/auth/withdraw/has-enough-balance",
    cache: {
      ttl: 600000,
    },
  },
  get_ongoing_withdraw: {
    method: RequestMethod.GET,
    path: "/payment/v1/auth/withdraw/ongoing",
    cache: {
      ttl: 5000,
    },
  },
  get_withdraw_history: {
    method: RequestMethod.GET,
    path: "/payment/v1/auth/withdraw/history",
    cache: {
      ttl: 30000,
    },
  },
  convert_swash_amount: {
    method: RequestMethod.GET,
    path: "/payment/v1/auth/withdraw/convert-amount-from-swash",
  },
  get_gift_card_info: {
    method: RequestMethod.GET,
    path: "/payment/v1/auth/gift-card/info",
    cache: {
      ttl: 30000,
    },
  },
  get_gift_card_products: {
    method: RequestMethod.GET,
    path: "/payment/v1/auth/gift-card/products",
    cache: {
      ttl: 30000,
    },
  },
  get_vouchers: {
    method: RequestMethod.GET,
    path: "/payment/v1/auth/voucher",
    cache: {
      key: "voucher",
      ttl: 1800000,
    },
  },
  get_referral_rewards: {
    method: RequestMethod.GET,
    path: "/payment/v1/auth/referral/sum",
    cache: {
      ttl: 30000,
    },
  },
  get_referral_history: {
    method: RequestMethod.GET,
    path: "/payment/v1/auth/referral/history",
    cache: {
      ttl: 30000,
    },
  },
  donate: {
    method: RequestMethod.POST,
    path: "/payment/v1/auth/donate",
    purge: {
      keys: ["balance"],
    },
  },
  get_donation_history: {
    method: RequestMethod.GET,
    path: "/payment/v1/auth/donate/history",
    cache: {
      ttl: 30000,
    },
  },
};
