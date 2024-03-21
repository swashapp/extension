import { OfferStatus } from "@/enums/history.enum";

export type HistoryReq = {
  page: number;
  pageSize: number;
};

export type EarnHistoryReq = {
  page: number;
  size: number;
  status?: OfferStatus;
};

export type HistoryRes<T> = {
  list: T[];
  total: number;
};

export type PaymentHistoryRes = {
  date: number;
  wallet: string;
  amount: string;
  module: string;
};

export type PaymentHistoryTableRes = {
  date: string;
  amount: string;
  module: string;
};

export type WithdrawHistoryRes = {
  date: number;
  wallet: string;
  amount: string;
  targetWallet: string;
  network: string;
  networkId: string;
  token: string;
  tokenId: string;
};

export type EarnHistoryRes = {
  id: number;
  userId: string;
  provider?: string;
  status: OfferStatus;
  surveyId: string;
  transactionId: string;
  amount: string;
  createDate: number;
  updateDate: number;
  country: string;
  wallet: string;

  offerName?: string;
  offerId?: string;
  image?: string;
  count?: number;
};

export type HistoryTableRes<T> = {
  data: T[];
  total: number;
};

export type WithdrawHistoryTableRes = {
  date: string;
  amount: string;
  receiver: string;
  network: string;
  token: string;
};

export type ReferralHistoryRes = {
  date: number;
  amount: string;
  wallet: string;
  refereeWallet: string;
};

export type ReferralHistoryTableRes = {
  date: string;
  amount: string;
  referral: string;
};

export type DonationHistoryRes = {
  date: number;
  amount: string;
  wallet: string;
  charityName: string;
  charityWallet: string;
  network: string;
  networkId: string;
  token: string;
  tokenId: string;
};

export type DonationHistoryTableRes = {
  date: string;
  amount: string;
  charity: string;
};

export type EarnHistoryTableRes = {
  date: string;
  provider?: string;
  offer?: string;
  amount: string;
  status: string;
};
