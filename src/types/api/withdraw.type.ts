import { VoucherStatusEnum } from "@/enums/voucher.enum";
import { WithdrawType } from "@/enums/withdraw.enum";

export type NormalWithdrawParams = {
  targetNetworkId: number;
  targetToken: string;
};

export type GiftCardWithdrawParams = {
  company: string;
};

export type VoucherWithdrawParams = {
  company: string;
  voucherId: number;
};

export type WithdrawReqParams = {
  [WithdrawType.Normal]: NormalWithdrawParams;
  [WithdrawType.GiftCard]: GiftCardWithdrawParams;
  [WithdrawType.GiftCardVoucher]: VoucherWithdrawParams;
  [WithdrawType.Donation]: NonNullable<unknown>;
};

export type WithdrawReq<K extends keyof WithdrawReqParams> = {
  userSignature: string;
  withdrawType: K;
  userWallet: string;
  receiver: string;
  withdrawAmount: number;
  withdrawTime: number;
  validityTime: number;
} & WithdrawReqParams[K];

export type WithdrawNetworkTokensRes = {
  id: string;
  min: number;
  fee: number;
  name: string;
  decimals: number;
  address: string;
  native: boolean;
  icon: string;
  path: string[];
  feePath: string[];
};

export type WithdrawNetworkInfoRes = {
  id: string;
  name: string;
  icon: string;
  swapContract: string;
  tokens: WithdrawNetworkTokensRes[];
};

export type ConvertSwashAmountReq = {
  networkId: string;
  outputTokenAddress: string;
  amount: number;
};

export type GetGiftCardProductReq = {
  country?: string;
  currency?: string;
  search?: string;
  category?: string;
  page?: number;
  pageSize?: number;
};

export type GetGiftCardProductRes = {
  id: string;
  name: string;
  category: string;
  imagePath: string;
  priceList: { dollar: string; swash: string }[];
  countryList: string[];
  currencyList: string[];
};

export type GetVoucherRes = {
  id: number;
  wallet: string;
  amount: string;
  createdDate: number;
  status: VoucherStatusEnum;
  updateDate: number;
};
