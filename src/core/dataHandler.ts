import { JsonPointer } from 'json-ptr';
import { JSONPath } from 'jsonpath-plus';

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
    streamConfig = await configManager.getConfig('stream');
  }

  function cancelSending(msgId: number) {
    databaseHelper.removeMessage(msgId).then();
    //clearTimeout(msgId);
    //storageHelper.removeMessage(msgId);
  }

  async function sendDelayedMessages() {
    const confs = await storageHelper.getConfigs();
    const time = Number(new Date().getTime()) - confs.delay * 60000;
    const rows = await databaseHelper.getReadyMessages(time);
    for (const row of rows) {
      const message = row.message;
      delete message.origin;
      try {
        streams[message.header.category].produceNewEvent(message);
      } catch (err) {
        console.error(`failed to produce new event because of: ${err.message}`);
      }
    }
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
      streams[message.header.category] = stream(
        streamConfig[module.category].streamId,
      );
    if (module.context) {
      const bct_attrs = module.context.filter((el: Any) => {
        return el.type === 'browser' && el.is_enabled;
      });
      if (bct_attrs.length > 0) {
        for (const ct of bct_attrs) {
          switch (ct.name) {
            case 'agent':
              message.header.agent = await browserUtils.getUserAgent();
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
    const collector = modules[message.header.module][
      message.header.function
    ].items.find((el: Any) => {
      return el.name === message.header.collector;
    });
    if (
      !db.configs.is_enabled ||
      filterUtils.filter(message.origin, filters) ||
      !modules[message.header.module].is_enabled ||
      !collector.is_enabled
    )
      return;
    const configs = db.configs;
    const profile = db.profile;
    const privacyData = db.privacyData;
    const delay = configs.delay;

    message.header.category = modules[message.header.module].category;
    message.header.privacyLevel = modules[message.header.module].privacyLevel;
    message.header.anonymityLevel =
      modules[message.header.module].anonymityLevel;
    message.header.version = browserUtils.getVersion();

    const uid = privacyUtils.anonymiseIdentity(
      configs.Id,
      message,
      modules[message.header.module],
    );
    const country = profile.country || (await userHelper.getUserCountry());
    const city = profile.city || '';
    const gender = profile.gender;
    const age = profile.age;
    const income = profile.income;
    const agent = await browserUtils.getUserAgent();
    const platform = await browserUtils.getPlatformInfo();
    const language = browserUtils.getBrowserLanguage();

    message.identity = {
      uid,
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
          ptr.set(data, jp, val, true);
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
