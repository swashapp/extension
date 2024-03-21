import { AcceptedAuth, RequestMethod, ResponseStatus } from "@/enums/api.enum";
import { SystemMessage } from "@/enums/message.enum";
import { CacheRequestOptions } from "@/types/api/request.type";
import {
  BaseErrorResponseDto,
  BaseSuccessfulResponseDto,
} from "@/types/api/response.type";
import { GatewaySyncType } from "@/types/api/sync.type";
import { getAppVersion } from "@/utils/browser.util";
import { Base64url } from "@/utils/encoding.util";

import { BaseError } from "../base-error";
import { CacheManager } from "../managers/cache.manager";
import { WalletManager } from "../managers/wallet.manager";
import { ApiService } from "../services/api.service";

async function transformer<T>(response: Response): Promise<T> {
  const body = (await response.json()) as
    | BaseSuccessfulResponseDto<T>
    | BaseErrorResponseDto;

  if (body.status === ResponseStatus.SUCCESS) return body.data as T;
  if (body.status === ResponseStatus.ERROR) throw new BaseError(body.message);

  throw new BaseError(SystemMessage.UNSUPPORTED_RESPONSE_TYPE);
}

export abstract class BaseSwashService {
  protected readonly api: ApiService;

  protected constructor(
    protected baseUrl: string,
    protected wallet: WalletManager,
    protected cache: CacheManager,
  ) {
    this.api = new ApiService(
      baseUrl,
      {
        headers: {
          "Content-Type": "application/json",
          "Swash-Extension": `v${getAppVersion()}`,
        },
        timeout: 5000,
      },
      this.cache,
    );
  }

  private tokenToString(type: AcceptedAuth, token: string): string {
    return `${type} ${token}`;
  }

  protected async fetch<I, O>(path: string, options: CacheRequestOptions<I>) {
    return this.api.fetch<I, O>(path, options, transformer);
  }

  public async getServerTimestamp() {
    return (
      await this.fetch<void, GatewaySyncType>(`/sync/v1/public/timestamp`, {
        method: RequestMethod.GET,
        cache: {
          ttl: 1,
        },
      })
    ).timestamp;
  }

  protected async generateToken<T extends AcceptedAuth>(
    type: T,
    email?: T extends AcceptedAuth.BASIC ? string : never,
    password?: T extends AcceptedAuth.BASIC ? string : never,
  ): Promise<string> {
    let token = this.cache.getSession(type);

    if (!token) {
      if (type === AcceptedAuth.BASIC)
        token = Base64url.encode(Buffer.from(`${email}:${password}`));
      else if (type === AcceptedAuth.EWT) {
        token = this.wallet.signToken({
          timestamp: await this.getServerTimestamp(),
          device_key: this.cache.get("device_key"),
        });
        await this.cache.setSession(type, token, 60000);
      }
    }

    return this.tokenToString(type, token || "");
  }
}
