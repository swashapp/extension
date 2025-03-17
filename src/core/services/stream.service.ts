import { BaseSwashService } from "@/core/base/swash.service";
import { CacheManager } from "@/core/managers/cache.manager";
import { WalletManager } from "@/core/managers/wallet.manager";
import { AcceptedAuth } from "@/enums/api.enum";
import { Message } from "@/types/message.type";
import { StreamServicesConfiguration } from "@/types/storage/configuration.type";

export class StreamService extends BaseSwashService<StreamServicesConfiguration> {
  constructor(
    config: StreamServicesConfiguration,
    wallet: WalletManager,
    cache: CacheManager,
  ) {
    super(config, wallet, cache);
  }

  public async publish(message: Message): Promise<void> {
    this.logger.info("Starting message publishing process");
    const token = this.cache.getSession("stream");

    const headers: Record<string, string> = {};
    if (token) {
      headers[this.conf.token_header] = token;
      this.logger.info("Existing token found for stream");
    }

    let retry = 0;
    const max = 5;
    const base = 1000;

    while (retry < max) {
      try {
        const resp = await this.api.fetch({
          ...this.conf.publish,
          headers: {
            "Content-Type": "application/json",
            Authorization: await this.generateToken(AcceptedAuth.EWT),
            ...headers,
          },
          data: message,
        });

        if (resp.status === 200) {
          const header = resp.headers.get(this.conf.token_header);
          if (header)
            await this.cache.setSession(
              "stream",
              header,
              this.conf.token_header_ttl,
            );

          this.logger.info("Message published");
          break;
        } else {
          this.logger.warn(
            `Cannot publish message. Status Code: ${resp.status}`,
          );
        }
      } catch (error) {
        this.logger.error("Publish message failed", error);
      }

      retry++;
      if (retry < max) {
        const delay = base * Math.pow(2, retry);
        this.logger.info(`Retrying in ${delay}ms (Attempt ${retry} of ${max})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else if (retry === max) {
        this.logger.error("Publish message failed after max retries");
      }
    }
  }
}
