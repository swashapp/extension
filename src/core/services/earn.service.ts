import { BaseSwashService } from "@/core/base/swash.service";
import { AcceptedAuth } from "@/enums/api.enum";
import { OfferStatus } from "@/enums/history.enum";
import {
  EarnHistoryReq,
  EarnHistoryRes,
  EarnHistoryTableRes,
  HistoryRes,
  HistoryTableRes,
} from "@/types/api/history.type";
import { GetOfferURLReq, GetOfferWallURLReq } from "@/types/api/offer.type";
import { Managers } from "@/types/app.type";
import { EarnServicesConfiguration } from "@/types/storage/configuration.type";
import { formatDate } from "@/utils/date.util";
import { purgeNumber } from "@/utils/string.util";

export class EarnService extends BaseSwashService<EarnServicesConfiguration> {
  constructor({ coordinator, cache, configs, wallet }: Managers) {
    super(configs.get("apis").earn, wallet, cache);

    coordinator.subscribe("isOutOfDate", (value, oldValue) => {
      if (value !== oldValue && !value)
        this.updateConfig(configs.get("apis").earn);
    });
  }

  public async getOfferUrl(provider: string, offerId: string): Promise<string> {
    return this.fetch<GetOfferURLReq, string>({
      ...this.conf.get_offer_url,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: {
        provider,
        offerId,
      },
    });
  }

  public async getOfferWallUrl(provider: string): Promise<string> {
    return this.fetch<GetOfferWallURLReq, string>({
      ...this.conf.get_offer_wall_url,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data: { provider },
    });
  }

  public async getEarnHistory(data: {
    page: number;
    size: number;
    status?: OfferStatus;
  }): Promise<HistoryTableRes<EarnHistoryRes>> {
    const { list, total } = await this.fetch<
      EarnHistoryReq,
      HistoryRes<EarnHistoryRes>
    >({
      ...this.conf.get_history,
      headers: {
        Authorization: await this.generateToken(AcceptedAuth.EWT),
      },
      data,
    });

    return { data: list, total };
  }

  public async getHistory(
    status: OfferStatus,
    page: number,
    size: number,
  ): Promise<HistoryTableRes<EarnHistoryTableRes>> {
    const { data, total } = await this.getEarnHistory(
      status === OfferStatus.ALL ? { page, size } : { status, page, size },
    );

    return {
      data: data.map(({ createDate, provider, offerName, amount, status }) => ({
        date: formatDate(createDate, "YYYY/MM/DD HH:mm:ss Z"),
        provider,
        offer: offerName,
        amount: purgeNumber(amount),
        status,
      })),
      total,
    };
  }
}
