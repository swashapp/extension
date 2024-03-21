import { DeviceType } from "@/enums/api.enum";

export type RegisterDeviceReq = {
  device_key: string;
  device_type: DeviceType;
  app_name: string;
  app_version: string;
  arch: string;
  os_name: string;
  os_version: string;
  user_agent: string;
};
