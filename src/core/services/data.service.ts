import { UserService } from "@/core/services/user.service";
import { StreamCategory, StreamCategoryLowered } from "@/enums/stream.enum";
import { Managers } from "@/types/app.type";
import { CollectedMessage, Message } from "@/types/message.type";
import {
  getAppVersion,
  getBrowserLanguage,
  getSystemInfo,
} from "@/utils/browser.util";
import { getAge, getTimestamp } from "@/utils/date.util";
import { match } from "@/utils/filter.util";
import { uuid } from "@/utils/id.util";
import { Logger } from "@/utils/log.util";
import { anonymiseIdentity, enforcePolicy } from "@/utils/privacy.util";

import { StreamService } from "./stream.service";

export class DataService {
  private sendInterval: NodeJS.Timeout | undefined;
  private streams: Record<string, StreamService> = {};
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    protected managers: Managers,
    protected user: UserService,
  ) {
    for (const key of Object.values(StreamCategory)) {
      this.streams[key] = new StreamService(
        this.managers.configs.get("apis").streams[
          key.toLowerCase() as StreamCategoryLowered
        ],
        this.managers.wallet,
        this.managers.cache,
      );
      this.logger.info(`Initialization completed for ${key} stream`);
    }

    this.onActiveChange = this.onActiveChange.bind(this);
    this.sendDelayed = this.sendDelayed.bind(this);

    this.onActiveChange(this.managers.coordinator.get("isActive"));
    this.managers.coordinator.subscribe("isActive", this.onActiveChange);
  }

  public async collect(collected: CollectedMessage): Promise<void> {
    this.logger.debug("Collecting message");
    if (!collected.origin) collected.origin = "undetermined";
    if (match(collected.origin, this.managers.privacy.get("filters"))) {
      this.logger.info("Message filtered due to privacy rules");
      return;
    }

    const [{ birth, gender, income }, { userAgent: agent, ...platform }] =
      await Promise.all([this.user.getAdditionalInfo(), getSystemInfo()]);
    const { country_name, city } = this.managers.cache.getData("location");
    const age = birth ? `${getAge(+birth)}` : "";

    const publisherId = this.managers.wallet.getAddress();
    collected.header.version = getAppVersion();
    const message: Message = {
      ...collected,
      identity: {
        publisherId,
        uid: anonymiseIdentity(publisherId, collected),
        country: country_name,
        city,
        age,
        gender,
        income,
        agent,
        platform,
        language: getBrowserLanguage(),
      },
    };

    enforcePolicy(message, this.managers.privacy.get("masks"));
    this.logger.debug("Message prepared for sending");
    await this.send(message, this.managers.preferences.get("delay"));
  }

  public async send(message: Message, delay: number = 0): Promise<void> {
    if (delay > 0) {
      this.logger.debug("Adding message to delayed queue");
      await this.managers.message.add(message);
    } else {
      this.logger.debug("Sending message immediately");
      delete message.origin;

      let sessionId = this.managers.cache.getSession("data_session_id");
      if (!sessionId) {
        this.logger.debug("No session id found, generating new one");
        sessionId = uuid();
        await this.managers.cache.setSession(
          "data_session_id",
          sessionId,
          3600,
        );
      }
      message.identity.sessionId = sessionId;
      await this.streams[message.header.category].publish(message);
      this.logger.info("Message published to stream");
      await this.managers.message.increment(message.header.module);
      this.logger.debug("Message count incremented");
    }
  }

  private onActiveChange(value: boolean): void {
    clearInterval(this.sendInterval);
    this.logger.debug("Cleared send interval");
    if (value) {
      this.sendInterval = setInterval(this.sendDelayed, 1000);
      this.logger.info("Send interval started");
    } else {
      this.logger.info("Send interval stopped");
    }
  }

  public async sendDelayed(): Promise<void> {
    const age = getTimestamp() - this.managers.preferences.get("delay");
    this.logger.debug("Fetching delayed messages older than threshold");
    const rows = await this.managers.message.getOlderThan(age);
    this.logger.debug(`Found ${rows.length} delayed messages`);
    for (const row of rows) {
      const message = { ...row.message };
      delete message.origin;
      this.logger.debug("Sending delayed message");
      this.send(message);
    }
    await this.managers.message.removeOlderThan(age);
    this.logger.debug("Removed delayed messages older than threshold");
  }
}
