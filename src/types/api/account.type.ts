import { AccountDetailsEnum } from "@/enums/api.enum";

import { EncryptedWallet } from "../wallet.type";

import { GetIpLocationRes } from "./ip.type";
import { VerifyCodeReq } from "./verification.type";

import type { OngoingDonationRes } from "./donation.type";
import type { GetAdditionalInfoRes, GetVerifiedInfoRes } from "./info.type";
import type { ReferralInfoRes } from "./referral.type";

export type RegisterAccountReq = VerifyCodeReq &
  EncryptedWallet & {
    referral_code?: string;
  };

export type ResetAccountReq = VerifyCodeReq & EncryptedWallet;

export type ResetWalletReq = VerifyCodeReq;

export type DeleteAccountReq = VerifyCodeReq;

export type MergeAccountReq = {
  wallet: string;
  amount: string;
  signature: string;
};

export type MigrateAccountReq = EncryptedWallet;

export type GetAccountDetailsQuery = {
  detail: AccountDetailsEnum[];
};

export type GetAccountsDetailsQuery = GetAccountDetailsQuery & {
  id?: string[];
  wallet?: string[];
};

export type GetEncryptedDataRes = {
  data: string;
};

export type AccountInfoRes = GetVerifiedInfoRes & {
  user_id: string;
  wallet: string;
  is_verified: boolean;
  is_active: boolean;
  last_activity: number;
};

export type LoginAccountRes = AccountInfoRes & { location: GetIpLocationRes };

export type GetMigrationRes =
  | {
      mergeable: false;
      migratable: false;
      email: string;
    }
  | {
      mergeable: true;
      migratable: boolean;
      email: string;
      balance: string;
      withdrawn: string;
    };

export type GetMergeHistoryRes = {
  timestamp: string;
  wallet: string;
};

export type GetAccountDetailsRes = AccountInfoRes & {
  referral?: ReferralInfoRes;
  donations?: OngoingDonationRes[];
  info?: GetAdditionalInfoRes;
};
