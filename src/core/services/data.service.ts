import { anonymiseIdentity, enforcePolicy } from 'utils/privacy.util';

import { StreamCategory } from '../../enums/stream.enum';
import { Managers } from '../../types/app.type';
import { CollectedMessage, Message } from '../../types/message.type';
import {
  getAppVersion,
  getBrowserLanguage,
  getSystemInfo,
  getUserAgent,
} from '../../utils/browser.util';
import { getAge, getTimestamp } from '../../utils/date.util';
import { match } from '../../utils/filter.util';
import { uuid } from '../../utils/id.util';

import { StreamService } from './stream.service';

export class DataService {
  private streams: Record<string, StreamService> = {};

  constructor(protected managers: Managers) {
    for (const key in Object.values(StreamCategory))
      this.streams[key] = new StreamService(
        '',
        '',
        this.managers.wallet,
        this.managers.cache,
      );
  }

  public async collect(collected: CollectedMessage): Promise<void> {
    if (!collected.origin) collected.origin = 'undetermined';
    if (match(collected.origin, this.managers.privacy.get('filters'))) return;

    const { birth, gender, income } = this.managers.cache.getData('info');
    const { country_name, city } = this.managers.cache.getData('location');

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

    enforcePolicy(message, this.managers.privacy.get('masks'));
    await this.send(message, this.managers.preferences.get('delay'));
  }

  public async send(message: Message, delay: number = 0): Promise<void> {
    if (delay > 0) {
      await this.managers.message.add(message);
    } else {
      delete message.origin;

      let sessionId = this.managers.cache.getSession('data_session_id');
      if (!sessionId) {
        sessionId = uuid();
        await this.managers.cache.setSession(
          'data_session_id',
          sessionId,
          3600,
        );
      }
      message.identity.sessionId = sessionId;

      try {
        await this.streams[message.header.category].publish(message);
        await this.managers.message.increment(message.header.module);
      } catch (err) {
        // TODO: should handle retry strategy
      }
    }
  }

  public async sendDelayed(): Promise<void> {
    const delayTime = this.managers.preferences.get('delay') * 60000;
    const thresholdTime = getTimestamp() - delayTime;
    const rows = await this.managers.message.getOlderThan(thresholdTime);

    for (const row of rows) {
      const message = { ...row.message };
      delete message.origin;

      await this.send(message);
    }

    await this.managers.message.removeOlderThan(thresholdTime);
  }
}
