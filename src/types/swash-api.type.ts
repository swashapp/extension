export type JoinResponse = {
  id: number;
};

export type ActiveReferralResponse = {
  start: Date;
  expire: Date;
  total: number;
  current: number;
  reward: number;
};

export type ReferralRewardResponse = {
  reward: string;
};

export type MinimumWithdrawResponse = {
  sponsor: {
    minimum: string;
  };
  gas: {
    limit: string;
    etherEquivalent: string;
  };
};

export type LocationResponse = {
  country: string;
  city: string;
};

export type WithdrawResponse = {
  message?: string;
  tx?: string;
};

export type ClaimRewardResponse = { tx: string };
