export type AdsTypeStatus = {
  fullScreen: boolean;
  pushNotification: boolean;
  integratedDisplay: boolean;
};

export type TimeBasedPausedAd = {
  until: number;
};
export type DomainBasedPausedAd = {
  domain: string;
};

export type PausedAdInfo = TimeBasedPausedAd | DomainBasedPausedAd;

export type AdsConfig = {
  status: AdsTypeStatus;
  paused: { [name: string]: PausedAdInfo[] };
};
