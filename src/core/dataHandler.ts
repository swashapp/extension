import { JSONPath } from 'jsonpath-plus';
import JsonPointer from 'jsonpointer';

import browser from 'webextension-polyfill';

import { Any } from '../types/any.type';
import { Message } from '../types/message.type';
import { StreamConfigs } from '../types/storage/configs/stream.type';
import { Module } from '../types/storage/module.type';
import { Stream } from '../types/stream.type';

import { browserUtils } from '../utils/browser.util';
import { commonUtils } from '../utils/common.util';
import { filterUtils } from '../utils/filter.util';
import { privacyUtils } from '../utils/privacy.util';

import { configManager } from './configManager';
import { databaseHelper } from './databaseHelper';
import { storageHelper } from './storageHelper';
import { stream } from './stream';
import { userHelper } from './userHelper';

const dataHandler = (function () {
  const streams: { [key: string]: Stream } = {};
  let streamConfig: StreamConfigs;

  async function init() {
    streamConfig = await configManager.getConfig('brubeckStream');
  }

  function cancelSending(msgId: number) {
    databaseHelper.removeMessage(msgId).then();
  }

  async function sendDelayedMessages() {
    const confs = await storageHelper.getConfigs();
    const states = await storageHelper.getStates();

    const time = Number(new Date().getTime()) - confs.delay * 60000;
    const rows = await databaseHelper.getReadyMessages(time);

    if (states.messageSession.expire < Date.now()) {
      states.messageSession.id = commonUtils.uuid();
    }

    for (const row of rows) {
      const message = row.message;
      delete message.origin;

      message.identity.sessionId = states.messageSession.id;
      states.messageSession.expire = Date.now() + 30 * 60000;

      try {
        streams[message.header.category].produceNewEvent(message);
      } catch (err: Any) {
        console.error(
          `failed to produce new event because of: ${err?.message}`,
        );
      }
    }

    await storageHelper.saveStates(states);
    await databaseHelper.removeReadyMessages(time);
  }

  async function sendData(message: Message, delay: number) {
    if (delay) {
      await databaseHelper.insertMessage(message);
    } else {
      delete message.origin;
      streams[message.header.category].produceNewEvent(message);
    }
  }

  async function prepareAndSend(
    message: Message,
    module: Module,
    delay: number,
    tabId: number,
  ) {
    if (!streams[message.header.category])
      streams[message.header.category] = await stream(
        streamConfig.client,
        streamConfig.api,
        streamConfig.endpoint,
        streamConfig.streams[module.category],
      );
    if (module.context) {
      const bct_attrs = module.context.filter((el: Any) => {
        return el.type === 'browser' && el.is_enabled;
      });
      if (bct_attrs.length > 0) {
        for (const ct of bct_attrs) {
          switch (ct.name) {
            case 'agent':
              message.header.agent = browserUtils.getUserAgent();
              break;
            case 'platform':
              message.header.platform = await browserUtils.getPlatformInfo();
              break;
            case 'language':
              message.header.language = browserUtils.getBrowserLanguage();
              break;
          }
        }
      }

      const cct_attrs = module.context.filter((el: Any) => {
        return el.type === 'content' && el.is_enabled;
      });

      if (cct_attrs.length > 0 && tabId) {
        const connectPort = browser.tabs.connect(tabId, {
          name: 'content-attributes',
        });
        connectPort.onMessage.addListener(async function (attrs) {
          for (const attrName of Object.keys(attrs)) {
            message.header[attrName] = attrs[attrName];
          }
          await sendData(message, delay);
        });
        return true;
      }
    }
    await sendData(message, delay);
    return false;
  }

  async function handle(message: Message, tabId: number) {
    message.header.id = commonUtils.uuid();
    if (!message.origin) message.origin = 'undetermined';
    const db = await storageHelper.getAll();
    //Return if Swash is disabled or the origin is excluded or module/collector is disabled
    const filters = db.filters;
    const modules = db.modules;

    if (
      !db.configs.is_enabled ||
      filterUtils.filter(message.origin, filters) ||
      !modules[message.header.module].is_enabled
    )
      return;
    const configs = db.configs;
    const profile = db.profile;
    const states = db.state;

    const privacyData = db.privacyData;
    const delay = configs.delay;

    message.header.category = modules[message.header.module].category;
    message.header.privacyLevel = modules[message.header.module].privacyLevel;
    message.header.anonymityLevel =
      modules[message.header.module].anonymityLevel;
    message.header.version = browserUtils.getVersion();

    const publisherId = userHelper.getWalletAddress();
    const uid = privacyUtils.anonymiseIdentity(
      configs.Id,
      message,
      modules[message.header.module],
    );
    const sessionId = states.messageSession.id;
    const country = profile.country || (await userHelper.getUserCountry());
    const city = profile.city || '';
    const gender = profile.gender;
    const age = profile.age;
    const income = profile.income;
    const agent = browserUtils.getUserAgent();
    const platform = await browserUtils.getPlatformInfo();
    const language = browserUtils.getBrowserLanguage();

    message.identity = {
      publisherId,
      uid,
      sessionId,
      country,
      city,
      gender,
      age,
      income,
      agent,
      platform,
      language,
    };

    enforcePolicy(message, privacyData);
    prepareAndSend(message, modules[message.header.module], delay, tabId).catch(
      (err) => {
        console.error(`An error occurred during preparing message, ${err}`);
      },
    );
  }
  function enforcePolicy(message: Message, privacyData: Any) {
    const data = message.data.out;
    const schems = message.data.schems;
    const ptr = JsonPointer;
    for (const d of schems) {
      const jPointers = JSONPath({
        path: d.jpath,
        resultType: 'pointer',
        json: message.data.out,
      });
      if (jPointers) {
        for (const jp of jPointers) {
          let val = ptr.get(message.data.out, jp);
          val = privacyUtils.anonymiseObject(val, d.type, message, privacyData);
          ptr.set(data, jp, val);
        }
      }
    }
    message.data = data;
    return message;
  }

  return {
    init,
    handle,
    cancelSending,
    sendDelayedMessages,
    enforcePolicy,
  };
})();
export { dataHandler };
