import { BaseError } from "@/base-error";
import { SystemMessage } from "@/enums/message.enum";
import { WEBSITE_URLs } from "@/paths";
import { Any } from "@/types/any.type";
import { RegisterAdServerRes } from "@/types/api/ads.type";
import { Managers } from "@/types/app.type";
import { AdsServicesConfiguration } from "@/types/storage/configuration.type";
import { Logger } from "@/utils/log.util";

import { ApiService } from "./api.service";

async function transformer<T>(response: Response): Promise<T> {
  if (response.status === 200) {
    return (await response.json()) as T;
  } else throw new BaseError(SystemMessage.FAILED_AD_SERVER_API_CALL);
}

export class AdsService {
  private readonly api: ApiService;
  private readonly service: AdsServicesConfiguration;
  private readonly logger = new Logger(this.constructor.name);

  constructor(protected manager: Managers) {
    this.service = this.manager.configs.get("apis").ads;
    this.api = new ApiService(
      this.service.base,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: this.service.timeout,
      },
      this.manager.cache,
    );
    this.logger.info("Initialization completed");
  }

  private async register() {
    this.logger.debug("Registering to ad server");
    return this.api.fetch<{ address: string }, RegisterAdServerRes>(
      {
        ...this.service.register,
        data: {
          address: this.manager.wallet.getAddress(),
        },
      },
      transformer,
    );
  }

  public async getAdSlot(width: number, height: number) {
    if (!this.manager.coordinator.isReady()) {
      this.logger.debug("Coordinator not ready, skipping ad slot retrieval");
      return { id: "", uuid: undefined };
    }
    this.logger.debug(`Retrieving ad slot for ${width}x${height}`);
    const info = await this.register();
    const found = info.zones.find(({ name }) => name === `${width}x${height}`);
    if (found) {
      this.logger.debug(`Ad zone found for dimensions ${width}x${height}`);
    } else {
      this.logger.debug(
        `No matching ad zone for dimensions ${width}x${height}`,
      );
    }
    return { id: info.foreignId, uuid: found?.uuid };
  }

  public async getAdHash(width: number, height: number): Promise<string> {
    this.logger.debug(`Fetching ad hash for ${width}x${height}`);
    try {
      const slot = await this.getAdSlot(width, height);
      if (!slot?.uuid) {
        this.logger.debug("Ad slot unavailable, returning empty hash");
        return "";
      }

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
      this.logger.debug("Generated impression id");

      await this.api.fetch({
        ...this.service.supply_register,
        data: {
          iid: impression,
        },
      });
      this.logger.debug("Registered impression id");

      const result = await this.api.fetch<Any, Any>(
        {
          ...this.service.supply_find,
          data: {
            context: {
              iid: impression,
              metamask: true,
              url: `${WEBSITE_URLs.adview}?${params}`,
            },
            placements: [{ id: "0", placementId: slot.uuid }],
          },
        },
        transformer,
      );
      this.logger.debug("Finding ad completed");

      const adHash = result.data?.[0]?.hash || "";
      this.logger.info("Ad hash retrieved successfully");
      return adHash;
    } catch (error) {
      this.logger.error("Failed to fetch ad hash", error);
      return "";
    }
  }
}
