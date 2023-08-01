export type State = {
  serverTimestamp: { value: number; expire: number };
  lastConfigUpdate: number;
  lastUserJoin: number;
  lastNotificationUpdate: number;
  messageSession: { id: string; expire: number };
  streamSessionToken: string;
};
