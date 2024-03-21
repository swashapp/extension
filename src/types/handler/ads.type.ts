export type AdPosition = {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
};

export type AdSize = { width: number; height: number };

type StickyAd = {
  type: "sticky";
  position: AdPosition;
};

type EmbeddedAd = { type: "embedded"; selector: string };

export type AdsDisplayCollector = {
  url_match: string;
  size: AdSize;
} & (StickyAd | EmbeddedAd);
