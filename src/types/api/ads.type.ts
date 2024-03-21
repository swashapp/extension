import { AdSize } from '../handler/ads.type';

export type RegisterAdServerRes = {
  foreignId: string;
  zones: ({ name: string; uuid: string } & AdSize)[];
};
