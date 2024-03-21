import { PlatformOS, PlatformType } from "@/enums/platform.enum";

export type PlatformMap = {
  [key in PlatformOS]: PlatformType;
};
