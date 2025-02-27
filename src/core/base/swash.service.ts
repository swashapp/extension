import { CacheManager } from "@/core/managers/cache.manager";
import { WalletManager } from "@/core/managers/wallet.manager";
import { ApiService } from "@/core/services/api.service";
import { AcceptedAuth } from "@/enums/api.enum";
import { CacheableRequest } from "@/types/api/request.type";
import { GatewaySyncType } from "@/types/api/sync.type";
import { SwashServiceConfiguration } from "@/types/storage/configuration.type";
import { getAppName, getAppVersion } from "@/utils/browser.util";
import { Base64url } from "@/utils/encoding.util";
import { Logger } from "@/utils/log.util";
import { swashResponseTransformer } from "@/utils/transformer.util";

export abstract class BaseSwashService<T extends SwashServiceConfiguration> {
  protected api!: ApiService;
  protected readonly logger = new Logger(this.constructor.name);

  protected constructor(
    protected conf: T,
    protected wallet: WalletManager,
    protected cache: CacheManager,
  ) {
    this.logger.info("Start initialization");
    this.init();
    this.logger.info("Initialization completed");
  }

  private init() {
    this.api = new ApiService(
      this.conf.base,
      {
        headers: {
          "Content-Type": "application/json",
          "Swash-App-Data": `${getAppName()} v${getAppVersion()}`,
        },
        timeout: this.conf.timeout,
      },
      this.cache,
    );
  }

  protected updateConfig(config: T) {
    this.logger.info("Updating configuration");
    this.conf = config;
    this.init();
    this.logger.info("Configuration updated");
  }

  protected tokenToString(type: AcceptedAuth, token: string): string {
    return `${type} ${token}`;
  }

  protected async fetch<I, O>(request: CacheableRequest<I>) {
    return this.api.fetch<I, O>(request, swashResponseTransformer);
  }

  protected async generateToken<T extends AcceptedAuth>(
    type: T,
    email?: T extends AcceptedAuth.BASIC ? string : never,
    password?: T extends AcceptedAuth.BASIC ? string : never,
  ): Promise<string> {
    this.logger.debug(`Generating token for auth type ${type}`);
    let token = this.cache.getSession(type);

    if (!token) {
      this.logger.debug(`No session token found for auth type ${type}`);
      if (type === AcceptedAuth.BASIC) {
        this.logger.debug("Creating BASIC token");
        token = Base64url.encode(Buffer.from(`${email}:${password}`));
      } else if (type === AcceptedAuth.EWT) {
        this.logger.debug("Creating EWT token");
        token = this.wallet.signToken({
          timestamp: await this.getServerTimestamp(),
          device_key: this.cache.get("device_key"),
        });
        await this.cache.setSession(type, token, 60000);
        this.logger.info("EWT token stored in cache");
      }
    }

    return this.tokenToString(type, token || "");
  }

  public async getServerTimestamp() {
    const result = await this.fetch<void, GatewaySyncType>({
      ...this.conf.sync,
    });
    return result.timestamp;
  }
}
