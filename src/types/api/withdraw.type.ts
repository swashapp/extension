import { VoucherStatusEnum } from "@/enums/voucher.enum";
import { WithdrawType } from "@/enums/withdraw.enum";

export type WithdrawTokenReq = {
  withdrawType: WithdrawType.Normal;
  userWallet: string;
  receiver: string;
  withdrawAmount: number;
  targetNetworkId: number;
  targetToken: string;
  withdrawTime: number;
  validityTime: number;
  userSignature: string;
};

export type WithdrawGiftCardReq = {
  amount: number;
  userWallet: string;
  company: string;
  voucherId?: number;
  withdrawTime: number;
  validityTime: number;
  userSignature: string;
};

export type WithdrawVoucherReq = {
  withdrawType: WithdrawType.GiftCardVoucher;
  userWallet: string;
  withdrawAmount: number;
  withdrawTime: number;
  validityTime: number;
  company: string;
  voucherId: number;
  userSignature: string;
};

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

export type WithdrawState = {
  id: string;
  name: string;
  text: string;
};

export type WithdrawInfoRes = {
  networks: WithdrawNetworkInfoRes[];
  withdrawStates: WithdrawState[];
};

export type ConvertSwashAmountReq = {
  networkId: string;
  outputTokenAddress: string;
  amount: number;
};

export type GetGiftCardProductReq = {
  country?: string;
  amount?: string;
  search?: string;
};

type PriceData = {
  dollar: string;
  swash: string;
};

type Country = {
  code: string;
  name: string;
};

export class GiftCardInfoRes {
  priceList: PriceData[] = [];
  countries: Country[] = [];
}

export type GetGiftCardProductRes = {
  id: string;
  name: string;
  category: string;
  imagePath: string;
  priceList: PriceData[];
  countryList: string[];
  currencyList: string[];
};

export type VoucherRes = {
  id: number;
  wallet: string;
  amount: string;
  createdDate: number;
  status: VoucherStatusEnum;
  updateDate: number;
};

export type GetVoucherRes = { [p: string]: VoucherRes[] };
