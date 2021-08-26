import { Strategy } from '../../enums/strategy.enum';

export type MemberManagerConfig = {
  minimumMessageNumber: number;
  sendTimeWindow: number;
  strategy: Strategy;
  tryInterval: number;
  maxInterval: number;
  failuresThreshold: number;
  backoffRate: number;
};
