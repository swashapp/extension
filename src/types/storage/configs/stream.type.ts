export type StreamInfo = {
  streamId: string;
  proxies: string[];
  minProxies: number;
};

export type StreamConfigs = {
  client: boolean;
  api: boolean;
  endpoint: string;
  streams: {
    [key in string]: StreamInfo;
  };
};

export type OldStreamConfigs = {
  [key in string]: { streamId: string };
};
