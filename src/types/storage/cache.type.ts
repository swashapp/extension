import { AcceptedAuth } from "@/enums/api.enum";
import { CloudServices } from "@/enums/cloud.enum";
import { Any } from "@/types/any.type";
import { AccountInfoRes } from "@/types/api/account.type";
import { GetAdditionalInfoRes } from "@/types/api/info.type";
import { GetIpLocationRes } from "@/types/api/ip.type";
import { getTimestamp, isTimeAfter } from "@/utils/date.util";

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
