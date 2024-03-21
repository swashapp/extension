import { BaseSwashService } from "@/core/base/swash.service";
import { CacheManager } from "@/core/managers/cache.manager";
import { WalletManager } from "@/core/managers/wallet.manager";
import { AcceptedAuth, RequestMethod } from "@/enums/api.enum";
import { OfferStatus } from "@/enums/history.enum";
import {
  EarnHistoryReq,
  EarnHistoryRes,
  HistoryRes,
  HistoryTableRes,
} from "@/types/api/history.type";

export class EarnService extends BaseSwashService {
  constructor(wallet: WalletManager, cache: CacheManager) {
    super("https://gateway-dev.swashapp.io/", wallet, cache);
  }

  public async getHistory(
    status: OfferStatus,
    page: number,
    size: number,
  ): Promise<HistoryTableRes<EarnHistoryRes>> {
    const { list, total } = await this.fetch<
      EarnHistoryReq,
      HistoryRes<EarnHistoryRes>
    >("/earn/v1/auth/earner/history", {
      method: RequestMethod.GET,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data:
        status === OfferStatus.ALL ? { page, size } : { status, page, size },
      cache: { ttl: 1 },
    });

    return { data: list, total };
  }
}
