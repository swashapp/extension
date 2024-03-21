import { AcceptedAuth } from "@/enums/api.enum";
import { CloudServices } from "@/enums/cloud.enum";
import { getTimestamp, isTimeAfter } from "@/utils/date.util";

import { Any } from "../any.type";
import { AccountInfoRes } from "../api/account.type";
import { GetAdditionalInfoRes } from "../api/info.type";
import { GetIpLocationRes } from "../api/ip.type";

export class TimeBasedCache<T> {
  public readonly value: T;
  private readonly expiry: number;

  constructor(value: T, ttl: number) {
    this.value = value;
    this.expiry = getTimestamp() + ttl;
  }

  get isExpired(): boolean {
    return isTimeAfter(this.expiry);
  }

  toJSON() {
    return {
      value: this.value,
      expiry: this.expiry,
    };
  }

  static fromJSON<T>(data: { value: T; expiry: number }): TimeBasedCache<T> {
    const cache = new TimeBasedCache<T>(data.value, 0);
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
