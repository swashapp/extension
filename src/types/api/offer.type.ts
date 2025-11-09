export type GetOffersRes = {
  data: {
    id: number;
    provider: string;
    offerId: string;
    offerName: string;
    amount: string;
    countries: string[];
    description: string;
    image: string;
    devices: string[];
    platforms: string[];
    categories: string[];
    popularity: number;
    clicks: number;
    url: string;
  }[];
  expire: number;
};

export type GetOfferURLReq = {
  provider: string;
  offerId: string;
};

export type GetOfferWallURLReq = {
  provider: string;
};
