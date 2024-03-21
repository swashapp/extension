import { AcceptedAuth } from "@/enums/api.enum";
import { Any } from "@/types/any.type";
import { Message } from "@/types/message.type";

import { BaseSwashService } from "../base/swash.service";
import { CacheManager } from "../managers/cache.manager";
import { WalletManager } from "../managers/wallet.manager";

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
    try {
      console.log("Starting message publishing process...");
      const token = this.cache.getSession("stream");

      const headers: Record<string, string> = {};
      if (token) {
        headers[this.header] = token;
        console.log(`Existing token for stream found: ${token}`);
      }

      const resp = await this.api.fetch(encodeURIComponent(this.streamId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await this.generateToken(AcceptedAuth.EWT)}`,
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
        console.log("Message published successfully.");
      } else {
        throw new Error(`Cannot publish message. Status Code: ${resp.status}`);
      }
    } catch (err) {
      console.error(
        `Error publishing message: ${(err as Any)?.message || err}`,
      );
    }
  }
}
