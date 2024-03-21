import { BaseSwashService } from "@/core/base/swash.service";
import { CacheManager } from "@/core/managers/cache.manager";
import { WalletManager } from "@/core/managers/wallet.manager";
import { AcceptedAuth } from "@/enums/api.enum";
import { Message } from "@/types/message.type";
import { Logger } from "@/utils/log.util";

export class StreamService extends BaseSwashService {
  private readonly header = "Swash-Session-Token";

  constructor(
    url: string,
    private streamId: string,
    wallet: WalletManager,
    cache: CacheManager,
  ) {
    super(url, wallet, cache);
  }

  public async publish(msg: Message): Promise<void> {
    Logger.info("Starting message publishing process...");
    const token = this.cache.getSession("stream");

    const headers: Record<string, string> = {};
    if (token) {
      headers[this.header] = token;
      Logger.info(`Existing token for stream found: ${token}`);
    }

    let retry = 0;
    const max = 5;
    const base = 1000;

    while (retry < max) {
      try {
        const resp = await this.api.fetch(encodeURIComponent(this.streamId), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: await this.generateToken(AcceptedAuth.EWT),
            ...headers,
          },
          data: JSON.stringify(msg),
        });

        if (resp.status === 200) {
          await this.cache.setSession(
            "stream",
            resp.headers.get(this.header) || "",
            1,
          );
          Logger.info("Message published successfully.");
          break;
        } else
          Logger.warn(`Cannot publish message. Status Code: ${resp.status}`);
      } catch (err) {
        Logger.error("Failed to publish message:", err);
      }

      retry++;
      if (retry < max) {
        const delay = base * Math.pow(2, retry);
        Logger.info(`Retrying in ${delay}ms... (Attempt ${retry} of ${max})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else if (retry === max) {
        Logger.error("Failed to publish message after max retries.");
      }
    }
  }
}
