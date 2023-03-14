export type StreamConfigs = {
  [key in string]: {
    streamId: string;
    proxies: string[];
    minProxies: number;
  };
};
