export type JoinRequest = {
  id: number;
};

export type ActiveReferralRequest = {
  start: Date;
  expire: Date;
  total: number;
  current: number;
  reward: number;
};

export type ReferralRewardRequest = {
  reward: string;
};

export type MinimumWithdrawRequest = {
  sponsor: {
    minimum: string;
  };
  gas: {
    limit: string;
    etherEquivalent: string;
  };
};

export type LocationRequest = {
  country: string;
  city: string;
};

export type WithdrawRequest = {
  message?: string;
  tx?: string;
};

export type ClaimRewardRequest = { tx: string };
