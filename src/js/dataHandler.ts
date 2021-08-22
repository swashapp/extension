// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { JsonPointer } from 'json-ptr';
import { JSONPath } from 'jsonpath-plus';

import { browserUtils } from './browserUtils';
import { configManager } from './configManager';
import { databaseHelper } from './databaseHelper';
import { filterUtils } from './filterUtils';
import { privacyUtils } from './privacyUtils';
import { storageHelper } from './storageHelper';
import { stream } from './stream';
import { swashApiHelper } from './swashApiHelper';
import { utils } from './utils';

const dataHandler = (function () {
  'use strict';
  const streams = {};
  let streamConfig;

  function init() {
    streamConfig = configManager.getConfig('stream');
  }

  function cancelSending(msgId) {
    databaseHelper.removeMessage(msgId);
    //clearTimeout(msgId);
    //storageHelper.removeMessage(msgId);
  }

  async function sendDelayedMessages() {
    const confs = await storageHelper.retrieveConfigs();
    const time = Number(new Date().getTime()) - confs.delay * 60000;
    const rows = await databaseHelper.getReadyMessages(time);
    for (const row of rows) {
      const message = row.message;
      delete message.origin;
      try {
        streams[message.header.category].produceNewEvent(message);
      } catch (err) {
        `failed to produce new event because of: ${err.message}`;
      }
    }
    await databaseHelper.removeReadyMessages(time);
  }

  async function sendData(message, delay) {
    if (delay) {
      await databaseHelper.insertMessage(message);
    } else {
      delete message.origin;
      streams[message.header.category].produceNewEvent(message);
    }
  }

  async function prepareAndSend(message, module, delay, tabId) {
    if (!streams[message.header.category])
      streams[message.header.category] = stream(
        streamConfig[module.category].streamId,
      );
    if (module.context) {
      const bct_attrs = module.context.filter(function (ele, val) {
        return ele.type === 'browser' && ele.is_enabled;
      });
      if (bct_attrs.length > 0) {
        for (const ct of bct_attrs) {
          switch (ct.name) {
            case 'agent':
              message.header.agent = await browserUtils.getUserAgent();
              break;
            case 'installedPlugins':
              message.header.installedPlugins =
                await browserUtils.getAllInstalledPlugins();
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

      const cct_attrs = module.context.filter(function (ele, val) {
        return ele.type === 'content' && ele.is_enabled;
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

  async function handle(message, tabId) {
    message.header.id = utils.uuid();
    if (!message.origin) message.origin = 'undetermined';
    const db = await storageHelper.retrieveAll();
    //Return if Swash is disabled or the origin is excluded or module/collector is disabled
    const filters = db.filters;
    const modules = db.modules;
    const collector = modules[message.header.module][
      message.header.function
    ].items.find((element) => {
      return element.name === message.header.collector;
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

    message.identity = {};
    message.identity.uid = privacyUtils.anonymiseIdentity(
      configs.Id,
      message,
      modules[message.header.module],
    );
    message.identity.country =
      profile.country || (await swashApiHelper.getUserCountry());
    message.identity.city = profile.city || '';
    message.identity.gender = profile.gender;
    message.identity.age = profile.age;
    message.identity.income = profile.income;
    message.identity.agent = await browserUtils.getUserAgent();
    message.identity.platform = await browserUtils.getPlatformInfo();
    message.identity.language = browserUtils.getBrowserLanguage();

    enforcePolicy(message, privacyData);
    prepareAndSend(message, modules[message.header.module], delay, tabId);
  }
  function enforcePolicy(message, privacyData) {
    const data = message.data.out;
    const schems = message.data.schems;
    const ptr = JsonPointer;
    for (const d of schems) {
      const jpointers = JSONPath({
        path: d.jpath,
        resultType: 'pointer',
        json: message.data.out,
      });
      if (jpointers) {
        for (const jp of jpointers) {
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
