export type MemberManagerConfigs = {
  strategy: string;
  heartbeatInterval: number;
  tryInterval: number;
  maxInterval: number;
  failuresThreshold: number;
  backoffRate: number;
};
