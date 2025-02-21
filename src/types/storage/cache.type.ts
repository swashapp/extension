import parser from "cron-parser";

import { AcceptedAuth } from "@/enums/api.enum";
import { CloudServices } from "@/enums/cloud.enum";
import { Any } from "@/types/any.type";
import { AccountInfoRes } from "@/types/api/account.type";
import { GetCharityInfoRes } from "@/types/api/charity.type";
import { GetAdditionalInfoRes } from "@/types/api/info.type";
import { GetIpLocationRes } from "@/types/api/ip.type";
import { getTimestamp, isTimeAfter } from "@/utils/date.util";
import { Logger } from "@/utils/log.util";

export class TimeBasedCache<T> {
  public readonly value: T;
  private readonly expiry: number;
  public readonly volatile: boolean;

  constructor(value: T, ttl: number | string, volatile: boolean = false) {
    this.value = value;
    if (typeof ttl === "string") {
      try {
        const interval = parser.parseExpression(ttl);
        this.expiry = interval.next().getTime();
      } catch (error) {
        this.expiry = getTimestamp() + 30000;
        Logger.error(`Failed to parse cron expression: ${ttl}`);
      }
    } else this.expiry = getTimestamp() + ttl;
    this.volatile = volatile;
  }

  get isExpired(): boolean {
    return isTimeAfter(this.expiry);
  }

  static toJSON(obj: TimeBasedCache<Any>): Any {
    return {
      value: obj.value,
      expiry: obj.expiry,
      volatile: obj.volatile,
    };
  }

  static fromJSON<T>(data: {
    value: T;
    expiry: number;
    volatile: boolean;
  }): TimeBasedCache<T> {
    const cache = new TimeBasedCache<T>(data.value, 0, data.volatile);
    (cache as Any).expiry = data.expiry;
    return cache;
  }
}

export type CacheStorage = {
  device_key: string;

  data: {
    account: TimeBasedCache<AccountInfoRes>;
    info: TimeBasedCache<GetAdditionalInfoRes>;
    location: TimeBasedCache<GetIpLocationRes>;
    charity: TimeBasedCache<GetCharityInfoRes[]>;
  } & Record<string, TimeBasedCache<Any>>;

  session: {
    [AcceptedAuth.EWT]?: TimeBasedCache<string>;
    [AcceptedAuth.BASIC]?: TimeBasedCache<string>;
    [CloudServices.GOOGLE_DRIVE]?: TimeBasedCache<string>;
    [CloudServices.DROPBOX]?: TimeBasedCache<string>;
    stream?: TimeBasedCache<string>;

    data_session_id?: TimeBasedCache<string>;
  };
};
