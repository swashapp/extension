export type MemberManagerConfigs = {
  strategy: string;
  heartbeatInterval: number;
  tryInterval: number;
  maxInterval: number;
  failuresThreshold: number;
  backoffRate: number;
  inAppNotification: {
    checkInterval: 300000;
    updateInterval: 3600000;
  };
  pushNotification: {
    updateInterval: number;
    checkInterval: number;
    raiseInterval: number;
  };
};
