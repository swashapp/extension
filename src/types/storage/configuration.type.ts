import { z } from "zod";

import { RequestMethod } from "@/enums/api.enum";
import { StreamCategory, StreamCategoryLowered } from "@/enums/stream.enum";
import { OnDiskModule } from "@/types/handler/module.type";

export const ApiPathConfigurationSchema = z.object({
  method: z.nativeEnum(RequestMethod),
  path: z.string(),
  timeout: z.number().optional(),
  cache: z
    .object({
      ttl: z.union([z.number(), z.string()]),
      key: z.string().optional(),
      volatile: z.boolean().optional(),
    })
    .optional(),
  purge: z
    .object({
      keys: z.array(z.string()),
    })
    .optional(),
});
export type ApiPathConfiguration = z.infer<typeof ApiPathConfigurationSchema>;

export const ApiServiceConfigurationSchema = z.object({
  base: z.string(),
  timeout: z.number(),
});
export type ApiServiceConfiguration = z.infer<
  typeof ApiServiceConfigurationSchema
>;

export const SwashServiceConfigurationSchema =
  ApiServiceConfigurationSchema.extend({
    sync: ApiPathConfigurationSchema,
  });
export type SwashServiceConfiguration = z.infer<
  typeof SwashServiceConfigurationSchema
>;

export const AdsServicesConfigurationSchema =
  ApiServiceConfigurationSchema.extend({
    register: ApiPathConfigurationSchema,
    supply_register: ApiPathConfigurationSchema,
    supply_find: ApiPathConfigurationSchema,
  });
export type AdsServicesConfiguration = z.infer<
  typeof AdsServicesConfigurationSchema
>;

export const EarnServicesConfigurationSchema =
  SwashServiceConfigurationSchema.extend({
    get_offer_url: ApiPathConfigurationSchema,
    get_history: ApiPathConfigurationSchema,
    get_offer_wall_url: ApiPathConfigurationSchema,
  });
export type EarnServicesConfiguration = z.infer<
  typeof EarnServicesConfigurationSchema
>;

export const PaymentServicesConfigurationSchema =
  SwashServiceConfigurationSchema.extend({
    get_balance: ApiPathConfigurationSchema,
    get_payment_history: ApiPathConfigurationSchema,

    get_withdraw_info: ApiPathConfigurationSchema,
    withdraw_by_crypto: ApiPathConfigurationSchema,
    withdraw_by_gift_card: ApiPathConfigurationSchema,
    withdraw_by_voucher: ApiPathConfigurationSchema,
    get_verify_threshold: ApiPathConfigurationSchema,
    get_ongoing_withdraw: ApiPathConfigurationSchema,
    get_withdraw_history: ApiPathConfigurationSchema,

    convert_swash_amount: ApiPathConfigurationSchema,

    get_gift_card_info: ApiPathConfigurationSchema,
    get_gift_card_products: ApiPathConfigurationSchema,
    get_vouchers: ApiPathConfigurationSchema,

    get_referral_rewards: ApiPathConfigurationSchema,
    get_referral_history: ApiPathConfigurationSchema,

    donate: ApiPathConfigurationSchema,
    get_donation_history: ApiPathConfigurationSchema,
  });
export type PaymentServicesConfiguration = z.infer<
  typeof PaymentServicesConfigurationSchema
>;

export const StreamServicesConfigurationSchema =
  SwashServiceConfigurationSchema.extend({
    publish: ApiPathConfigurationSchema,
  });
export type StreamServicesConfiguration = z.infer<
  typeof StreamServicesConfigurationSchema
>;

export const StreamsServicesConfigurationSchema = z.object({
  [StreamCategoryLowered.BEAUTY]: StreamServicesConfigurationSchema,
  [StreamCategoryLowered.GENERAL]: StreamServicesConfigurationSchema,
  [StreamCategoryLowered.MUSIC]: StreamServicesConfigurationSchema,
  [StreamCategoryLowered.NEWS]: StreamServicesConfigurationSchema,
  [StreamCategoryLowered.SEARCH]: StreamServicesConfigurationSchema,
  [StreamCategoryLowered.SHOPPING]: StreamServicesConfigurationSchema,
  [StreamCategoryLowered.SOCIAL]: StreamServicesConfigurationSchema,
});
export type StreamsServicesConfiguration = z.infer<
  typeof StreamsServicesConfigurationSchema
>;

export const UserServicesConfigurationSchema =
  SwashServiceConfigurationSchema.extend({
    v2_contract_address: z.string(),
    v3_vault_address: z.string(),

    init_verify: ApiPathConfigurationSchema,
    reset_verify: ApiPathConfigurationSchema,

    register: ApiPathConfigurationSchema,
    get_encrypted_data: ApiPathConfigurationSchema,
    login: ApiPathConfigurationSchema,

    reset_account: ApiPathConfigurationSchema,
    reset_password: ApiPathConfigurationSchema,
    reset_wallet: ApiPathConfigurationSchema,

    get_migration: ApiPathConfigurationSchema,
    migrate: ApiPathConfigurationSchema,
    merge: ApiPathConfigurationSchema,
    get_merge_history: ApiPathConfigurationSchema,

    get_account_details: ApiPathConfigurationSchema,
    update_verified_info: ApiPathConfigurationSchema,
    get_available_additional_info: ApiPathConfigurationSchema,
    update_additional_info: ApiPathConfigurationSchema,
    get_additional_info: ApiPathConfigurationSchema,

    get_referral_summary: ApiPathConfigurationSchema,
    get_referral_links: ApiPathConfigurationSchema,
    add_referral_link: ApiPathConfigurationSchema,
    set_default_referral_link: ApiPathConfigurationSchema,

    get_available_donations: ApiPathConfigurationSchema,
    get_ongoing_donations: ApiPathConfigurationSchema,
    add_ongoing_donation: ApiPathConfigurationSchema,
    remove_ongoing_donation: ApiPathConfigurationSchema,

    get_app_config: ApiPathConfigurationSchema,
  });
export type UserServicesConfiguration = z.infer<
  typeof UserServicesConfigurationSchema
>;

export const CloudServicesConfigurationSchema = z.object({
  dropbox_client_key: z.string(),
  google_drive_client_key: z.string(),
  timeout: z.number(),
});
export type CloudServicesConfiguration = z.infer<
  typeof CloudServicesConfigurationSchema
>;

export const ModuleConfigurationSchema = z.object({
  [StreamCategory.BEAUTY]: z.record(z.any()),
  [StreamCategory.GENERAL]: z.record(z.any()),
  [StreamCategory.MUSIC]: z.record(z.any()),
  [StreamCategory.NEWS]: z.record(z.any()),
  [StreamCategory.SEARCH]: z.record(z.any()),
  [StreamCategory.SHOPPING]: z.record(z.any()),
  [StreamCategory.SOCIAL]: z.record(z.any()),
});
export type ModuleConfiguration = Record<
  StreamCategory,
  Record<string, OnDiskModule>
>;

export const UnsplashConfigurationSchema = z.object({
  endpoint: z.string(),
  threshold: z.number(),
  image: z.record(z.string()),
});
export type UnsplashConfiguration = z.infer<typeof UnsplashConfigurationSchema>;

export const ConfigurationStorageSchema = z.object({
  version: z.string(),
  apis: z.object({
    ads: AdsServicesConfigurationSchema,
    earn: EarnServicesConfigurationSchema,
    payment: PaymentServicesConfigurationSchema,
    streams: StreamsServicesConfigurationSchema,
    user: UserServicesConfigurationSchema,
  }),
  cloud_storages: CloudServicesConfigurationSchema,
  modules: ModuleConfigurationSchema,
  unsplash: UnsplashConfigurationSchema,
  update: z.object({
    interval: z.number(),
    last_revision: z.string(),
  }),
});
export type ConfigurationStorage = z.infer<typeof ConfigurationStorageSchema>;
