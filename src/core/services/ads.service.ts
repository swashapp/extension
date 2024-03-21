import { BaseError } from "@/core/base-error";
import { CacheManager } from "@/core/managers/cache.manager";
import { WalletManager } from "@/core/managers/wallet.manager";
import { RequestMethod } from "@/enums/api.enum";
import { SystemMessage } from "@/enums/message.enum";
import { WebsiteURLs } from "@/paths";
import { Any } from "@/types/any.type";
import { RegisterAdServerRes } from "@/types/api/ads.type";

import { ApiService } from "./api.service";

async function transformer<T>(response: Response): Promise<T> {
  if (response.status === 200) {
    return (await response.json()) as T;
  } else throw new BaseError(SystemMessage.FAILED_AD_SERVER_API_CALL);
}

export class AdsService {
  private readonly api: ApiService;

  constructor(
    protected wallet: WalletManager,
    protected cache: CacheManager,
  ) {
    this.api = new ApiService(
      "https://app.swashapp.io",
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 5000,
      },
      this.cache,
    );
  }

  private async register() {
    return this.api.fetch<{ address: string }, RegisterAdServerRes>(
      "/auth/foreign/register",
      {
        method: "POST",
        data: {
          address: this.wallet.getAddress(),
        },
        cache: {
          ttl: 1,
        },
      },
      transformer,
    );
  }

  public async getAdSlot(width: number, height: number) {
    const info = await this.register();
    const found = info.zones.find(({ name }) => name === `${width}x${height}`);
    return { id: info.foreignId, uuid: found?.uuid };
  }

  public async getAdHash(width: number, height: number): Promise<string> {
    try {
      const slot = await this.getAdSlot(width, height);
      if (!slot?.uuid) return "";

      const params = new URLSearchParams({
        id: slot.uuid,
        w: `${width}`,
        h: `${height}`,
      }).toString();

      const generateImpressionId = (): string => {
        const bytes = new Uint8Array(16);
        window.crypto.getRandomValues(bytes);
        let binary = "";
        bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
        return btoa(binary).replace(
          /=+|[+/]/g,
          (match) =>
            ({
              "+": "-",
              "/": "_",
              "=": "",
            })[match] || "",
        );
      };

      const impression = generateImpressionId();

      await this.api.fetch(`/supply/register?iid=${impression}`, {});

      const result = await this.api.fetch<Any, Any>(
        "/supply/find",
        {
          method: RequestMethod.POST,
          data: {
            context: {
              iid: impression,
              metamask: true,
              url: `${WebsiteURLs.adview}?${params}`,
            },
            placements: [{ id: "0", placementId: slot.uuid }],
          },
        },
        transformer,
      );

      return result.data?.[0]?.hash || "";
    } catch (error) {
      console.error("Error fetching available ads:", error);
      return "";
    }
  }
}
