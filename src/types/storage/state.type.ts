export type State = {
  serverTimestamp: { value: number; expire: number };
  lastConfigUpdate: number;
  lastUserJoin: number;
  lastInAppNotificationUpdate: number;
  lastPushNotificationUpdate: { timestamp: number; check: number };
  lastPushNotificationRaise: number;
  messageSession: { id: string; expire: number };
  streamSessionToken: string;
};
