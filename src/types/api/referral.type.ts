export type AddReferralLinkReq = {
  title: string;
  referral_share: number;
  is_default: boolean;
};

export type DefaultReferralLinkReq = {
  referral_id: string;
};

export type ModifyReferralLinkReq = AddReferralLinkReq & DefaultReferralLinkReq;

export type ReferralLinkRes = {
  id: string;
  title: string;
  code: string;
  referral_share: number;
  registrations: number;
  is_default: boolean;
};

export type ReferralSummaryRes = {
  registrations: number;
  default_link?: ReferralLinkRes;
};

export type ReferralInfoRes = {
  user_id: string;
  wallet: string;
  referral_share: number;
};
