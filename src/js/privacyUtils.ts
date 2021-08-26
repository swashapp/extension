import { sha256 } from 'ethers/lib/utils';

import { ObjectType } from '../enums/object.enum';
import { Any } from '../types/any.type';
import { Message } from '../types/message.type';
import { Module } from '../types/module.type';

import { utils } from './utils';

const privacyUtils = (function () {
  'use strict';
  let basicIdentity = '';
  const moduleIdentity: Any = {};
  const categoryIdentity: Any = {};

  function anonymiseIdentity(id: string, message: Message, module: Module) {
    basicIdentity = basicIdentity ? basicIdentity : sha256(id);

    switch (message.header.anonymityLevel) {
      case 0:
        return basicIdentity;
      case 1:
        categoryIdentity[module.category] = categoryIdentity[module.category]
          ? categoryIdentity[module.category]
          : sha256(`${id}${module.category}`);
        return sha256(`${basicIdentity}${categoryIdentity[module.category]}`);
      case 2:
        moduleIdentity[module.name] = moduleIdentity[module.name]
          ? moduleIdentity[module.name]
          : sha256(`${id}${module.name}`);
        return sha256(`${basicIdentity}${moduleIdentity[module.name]}`);
      case 3:
        return sha256(`${basicIdentity}${message.header.id}`);
      default:
        return sha256(`${basicIdentity}${message.header.id}`);
    }
  }

  function anonymiseUrl(url: string, message: Message) {
    const urlObj = new URL(url);
    let path = [];
    switch (message.header.privacyLevel) {
      case 0:
        return urlObj.href;
      case 1:
        urlObj.searchParams.forEach((item) => {
          urlObj.searchParams.set(item[0], '');
        });
        return urlObj.href;
      case 2:
        path = urlObj.pathname.split('/');
        for (const item in path) {
          if (path[item]) {
            path[item] = sha256(path[item]).substring(0, path[item].length);
          }
        }
        return urlObj.origin + path.join('/');
      case 3:
        return urlObj.origin;
      default:
        return urlObj.origin;
    }
  }

  function anonymiseTime(time: number, message: Message) {
    const date = new Date();
    let date2;
    date.setTime(time);
    switch (message.header.privacyLevel) {
      case 0:
        return date.getTime();
      case 1:
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      case 2:
        date2 = new Date(0);
        date2.setFullYear(date.getFullYear(), date.getMonth());
        return date2.getTime();
      case 3:
        date2 = new Date(0);
        date2.setFullYear(date.getFullYear(), 0);
        return date2.getTime();
      default:
        return date.getTime();
    }
  }

  function anonymiseText(text: string, message: Message, privacyData: Any) {
    let retText = JSON.stringify(text);
    switch (message.header.privacyLevel) {
      case 0:
        for (let i = 0; i < privacyData.length; i++) {
          retText = retText.replace(
            new RegExp('\\b' + privacyData[i].value + '\\b', 'ig'),
            new Array(privacyData[i].value.length + 1).join('*'),
          );
        }
        break;
      case 1:
        for (let i = 0; i < privacyData.length; i++) {
          retText = retText.replace(
            new RegExp('\\b' + privacyData[i].value + '\\b', 'ig'),
            '',
          );
        }
        break;
      case 2:
        for (let i = 0; i < privacyData.length; i++) {
          retText = retText.replace(
            new RegExp('\\b' + privacyData[i].value + '\\b', 'ig'),
            '',
          );
        }
        break;
      case 3:
        for (let i = 0; i < privacyData.length; i++) {
          const res = retText.match(
            new RegExp('\\b' + privacyData[i].value + '\\b', 'ig'),
          );
          if (res) {
            retText = '""';
            break;
          }
        }
        break;
      default:
        return '';
    }
    return JSON.parse(retText);
  }

  function anonymiseUserInfo(user: Any, message: Message) {
    let retUserInfo = user;

    switch (message.header.privacyLevel) {
      case 0:
        return retUserInfo;
      case 1:
        retUserInfo = sha256(user);
        return retUserInfo;
      case 2:
        retUserInfo = sha256(user + utils.uuid());
        return retUserInfo;
      case 3:
        return '';
      default:
        return '';
    }
  }

  function anonymiseUserId(id: string, message: Message) {
    let retId = id;

    switch (message.header.privacyLevel) {
      case 0:
        return retId;
      case 1:
        retId = sha256(id);
        return retId;
      case 2:
        retId = sha256(id + utils.uuid());
        return retId;
      case 3:
        return '';
      default:
        return '';
    }
  }

  function anonymiseUserAttr(userAttr: Any, message: Message) {
    let retAttr = userAttr;

    switch (message.header.privacyLevel) {
      case 0:
        return retAttr;
      case 1:
        retAttr = sha256(userAttr);
        return retAttr;
      case 2:
        retAttr = sha256(userAttr + utils.uuid());
        return retAttr;
      case 3:
        return '';
      default:
        return '';
    }
  }

  function anonymiseTimeString(timeStr: string, message: Message) {
    const date = new Date(timeStr);
    const newTime = anonymiseTime(date.getTime(), message);
    date.setTime(newTime);
    return date.toString();
  }

  function anonymiseObject(
    object: Any,
    objectType: ObjectType,
    message: Message,
    privacyData: Any,
  ) {
    if (!object) return object;
    switch (objectType) {
      case ObjectType.UserInfo:
        return anonymiseUserInfo(object, message);
      case ObjectType.UserAttr:
        return anonymiseUserAttr(object, message);
      case ObjectType.TimeString:
        return anonymiseTimeString(object, message);
      case ObjectType.URL:
        return anonymiseUrl(object, message);
      case ObjectType.Time:
        return anonymiseTime(object, message);
      case ObjectType.Text:
        return anonymiseText(object, message, privacyData);
      case ObjectType.ID:
        return anonymiseUserId(object, message);
      default:
        return object;
    }
  }

  return {
    anonymiseObject,
    anonymiseIdentity,
  };
})();
export { privacyUtils };
