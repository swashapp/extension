import { AdSize } from "@/types/handler/ads.type";

export type RegisterAdServerRes = {
  foreignId: string;
  zones: ({ name: string; uuid: string } & AdSize)[];
};
