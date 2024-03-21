import { AcceptedAuth, RequestMethod } from "@/enums/api.enum";
import { OfferStatus } from "@/enums/history.enum";
import { Any } from "@/types/any.type";

import { BaseSwashService } from "../base/swash.service";
import { CacheManager } from "../managers/cache.manager";
import { WalletManager } from "../managers/wallet.manager";

export class EarnService extends BaseSwashService {
  constructor(wallet: WalletManager, cache: CacheManager) {
    super("https://gateway-dev.swashapp.io/", wallet, cache);
  }

  public async getHistory(status: OfferStatus, page: number, size: number) {
    return this.fetch<Any, [Any[], number]>("/earn/v1/auth/earner/history", {
      method: RequestMethod.GET,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data:
        status === OfferStatus.ALL ? { page, size } : { status, page, size },
      cache: { ttl: 1 },
    });
  }
}
