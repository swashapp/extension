import { AccountDetailsEnum } from "@/enums/api.enum";

import { GetIpLocationRes } from "./ip.type";
import { VerifyCodeReq } from "./verification.type";

import type { OngoingRes } from "./donation.type";
import type { GetAdditionalInfoRes, GetVerifiedInfoRes } from "./info.type";
import type { ReferralInfoRes } from "./referral.type";

export type RegisterAccountReq = VerifyCodeReq & {
  data?: string;
  password?: string;
  referral_code?: string;
};

export type ResetAccountReq = VerifyCodeReq & {
  data: string;
  password: string;
};

export type ResetWalletReq = VerifyCodeReq;

export type DeleteAccountReq = VerifyCodeReq;

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

export type GetAccountDetailsRes = AccountInfoRes & {
  referral?: ReferralInfoRes;
  donations?: OngoingRes[];
  info?: GetAdditionalInfoRes;
};
