export type MemberManagerConfigs = {
  minimumMessageNumber: number;
  sendTimeWindow: number;
  strategy: string;
  tryInterval: number;
  maxInterval: number;
  failuresThreshold: number;
  backoffRate: number;
};
