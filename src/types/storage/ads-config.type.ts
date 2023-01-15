export type AdsTypeStatus = {
  fullScreen: boolean;
  pushNotification: boolean;
  integratedDisplay: boolean;
};

export type AdsConfig = {
  status: AdsTypeStatus;
};
