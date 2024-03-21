import { DeviceType } from "@/enums/api.enum";

import { Any } from "../any.type";

export type GetAppConfigQuery = {
  device_type: DeviceType.EXTENSION;
  app_name: string;
  app_version: string;
  last_version?: string;
};

export type GetAppConfigRes = void | {
  version: number;
  config: Any;
};
