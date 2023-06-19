export type State = {
  lastConfigUpdate: number;
  serverTimestamp: { value: number; expire: number };
  lastUserJoin: number;
  messageSession: { id: string; expire: number };
  streamSessionToken: string;
};
