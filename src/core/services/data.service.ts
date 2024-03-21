import { StreamCategory } from "@/enums/stream.enum";
import { Managers } from "@/types/app.type";
import { CollectedMessage, Message } from "@/types/message.type";
import {
  getAppVersion,
  getBrowserLanguage,
  getSystemInfo,
  getUserAgent,
} from "@/utils/browser.util";
import { getAge, getTimestamp } from "@/utils/date.util";
import { match } from "@/utils/filter.util";
import { uuid } from "@/utils/id.util";
import { anonymiseIdentity, enforcePolicy } from "@/utils/privacy.util";

import { StreamService } from "./stream.service";

export class DataService {
  private sendInterval: NodeJS.Timeout | undefined;
  private streams: Record<string, StreamService> = {};

  constructor(protected managers: Managers) {
    for (const key of Object.values(StreamCategory)) {
      this.streams[key] = new StreamService(
        "https://stream-dev.swashapp.io/streamr/v1/auth/",
        `swashdu.eth/${key}`,
        this.managers.wallet,
        this.managers.cache,
      );
    }

    this.onActiveChange = this.onActiveChange.bind(this);
    this.sendDelayed = this.sendDelayed.bind(this);

    this.onActiveChange(this.managers.coordinator.get("isActive"));
    this.managers.coordinator.subscribe("isActive", this.onActiveChange);
  }

  public async collect(collected: CollectedMessage): Promise<void> {
    if (!collected.origin) collected.origin = "undetermined";
    if (match(collected.origin, this.managers.privacy.get("filters"))) return;

    const { birth, gender, income } = this.managers.cache.getData("info");
    const { country_name, city } = this.managers.cache.getData("location");

    const publisherId = this.managers.wallet.getAddress();
    collected.header.version = getAppVersion();
    const message: Message = {
      ...collected,
      identity: {
        publisherId,
        uid: anonymiseIdentity(publisherId, collected),
        country: country_name,
        city,
        age: `${getAge(+birth)}`,
        gender,
        income,
        agent: getUserAgent(),
        platform: await getSystemInfo(),
        language: getBrowserLanguage(),
      },
    };

    enforcePolicy(message, this.managers.privacy.get("masks"));
    await this.send(message, this.managers.preferences.get("delay"));
  }

  public async send(message: Message, delay: number = 0): Promise<void> {
    if (delay > 0) {
      await this.managers.message.add(message);
    } else {
      delete message.origin;

      let sessionId = this.managers.cache.getSession("data_session_id");
      if (!sessionId) {
        sessionId = uuid();
        await this.managers.cache.setSession(
          "data_session_id",
          sessionId,
          3600,
        );
      }
      message.identity.sessionId = sessionId;
      await this.streams[message.header.category].publish(message);
      await this.managers.message.increment(message.header.module);
    }
  }

  private onActiveChange(value: boolean): void {
    clearInterval(this.sendInterval);
    if (value) this.sendInterval = setInterval(this.sendDelayed, 1000);
  }

  public async sendDelayed(): Promise<void> {
    const age = getTimestamp() - this.managers.preferences.get("delay");
    const rows = await this.managers.message.getOlderThan(age);

    for (const row of rows) {
      const message = { ...row.message };
      delete message.origin;

      this.send(message);
    }

    await this.managers.message.removeOlderThan(age);
  }
}
