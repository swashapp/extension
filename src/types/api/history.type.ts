export type HistoryReq = {
  page: number;
  pageSize: number;
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
  referee: string;
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
