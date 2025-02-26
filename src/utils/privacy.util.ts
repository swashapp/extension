import { JSONPath } from "jsonpath-plus";
import JsonPointer from "jsonpointer";

import { ObjectType } from "@/enums/object.enum";
import { HashAlgorithm } from "@/enums/security.enum";
import { Any } from "@/types/any.type";
import { CollectedMessage, Message } from "@/types/message.type";
import { MaskStorage } from "@/types/storage/privacy.type";
import { Logger } from "@/utils/log.util";

import { uuid } from "./id.util";
import { hash } from "./security.util";

export function enforcePolicy(message: Message, masks: MaskStorage[]): Message {
  const data = message.data.out;
  const schems = message.data.schems;

  for (const schem of schems) {
    const jPointers: string[] = JSONPath({
      path: schem.jpath,
      resultType: "pointer",
      json: message.data.out,
    });

    if (jPointers && jPointers.length > 0) {
      for (const jp of jPointers) {
        let value = JsonPointer.get(message.data.out, jp);
        value = anonymiseObject(value, schem.type, message, masks);
        JsonPointer.set(data, jp, value);
      }
    }
  }

  message.data = data;
  return message;
}

export function anonymiseIdentity(id: string, message: CollectedMessage) {
  const basicIdentity = hash(HashAlgorithm.SHA256, id);

  switch (message.header.anonymityLevel) {
    case 0:
      return basicIdentity;
    case 1:
      return hash(
        HashAlgorithm.SHA256,
        `${basicIdentity}${hash(
          HashAlgorithm.SHA256,
          `${id}${message.header.category}`,
        )}`,
      );
    case 2:
      return hash(
        HashAlgorithm.SHA256,
        `${basicIdentity}${hash(
          HashAlgorithm.SHA256,
          `${id}${message.header.module}`,
        )}`,
      );
    case 3:
      return hash(HashAlgorithm.SHA256, `${basicIdentity}${message.header.id}`);
    default:
      return hash(HashAlgorithm.SHA256, `${basicIdentity}${message.header.id}`);
  }
}

function anonymiseObject(
  object: Any,
  objectType: ObjectType,
  message: Message,
  masks: MaskStorage[],
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
      return anonymiseText(object, message, masks);
    case ObjectType.ID:
      return anonymiseUserId(object, message);
    default:
      return object;
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
        urlObj.searchParams.set(item[0], "");
      });
      return urlObj.href;
    case 2:
      path = urlObj.pathname.split("/");
      for (const item in path) {
        if (path[item]) {
          path[item] = hash(HashAlgorithm.SHA256, path[item]).substring(
            0,
            path[item].length,
          );
        }
      }
      return urlObj.origin + path.join("/");
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

function anonymiseText(text: string, message: Message, masks: MaskStorage[]) {
  let retText = JSON.stringify(text);
  switch (message.header.privacyLevel) {
    case 0:
      Logger.info(masks);
      for (let i = 0; i < masks.length; i++) {
        retText = retText.replace(
          new RegExp("\\b" + masks[i] + "\\b", "ig"),
          new Array(masks[i].length + 1).join("*"),
        );
      }
      break;
    case 1:
      for (let i = 0; i < masks.length; i++) {
        retText = retText.replace(
          new RegExp("\\b" + masks[i] + "\\b", "ig"),
          "",
        );
      }
      break;
    case 2:
      for (let i = 0; i < masks.length; i++) {
        retText = retText.replace(
          new RegExp("\\b" + masks[i] + "\\b", "ig"),
          "",
        );
      }
      break;
    case 3:
      for (let i = 0; i < masks.length; i++) {
        const res = retText.match(new RegExp("\\b" + masks[i] + "\\b", "ig"));
        if (res) {
          retText = '""';
          break;
        }
      }
      break;
    default:
      return "";
  }
  return JSON.parse(retText);
}

function anonymiseUserInfo(user: Any, message: Message) {
  let retUserInfo = user;

  switch (message.header.privacyLevel) {
    case 0:
      return retUserInfo;
    case 1:
      retUserInfo = hash(HashAlgorithm.SHA256, user);
      return retUserInfo;
    case 2:
      retUserInfo = hash(HashAlgorithm.SHA256, user + uuid());
      return retUserInfo;
    case 3:
      return "";
    default:
      return "";
  }
}

function anonymiseUserId(id: string, message: Message) {
  let retId = id;

  switch (message.header.privacyLevel) {
    case 0:
      return retId;
    case 1:
      retId = hash(HashAlgorithm.SHA256, id);
      return retId;
    case 2:
      retId = hash(HashAlgorithm.SHA256, id + uuid());
      return retId;
    case 3:
      return "";
    default:
      return "";
  }
}

function anonymiseUserAttr(userAttr: Any, message: Message) {
  let retAttr = userAttr;

  switch (message.header.privacyLevel) {
    case 0:
      return retAttr;
    case 1:
      retAttr = hash(HashAlgorithm.SHA256, userAttr);
      return retAttr;
    case 2:
      retAttr = hash(HashAlgorithm.SHA256, userAttr + uuid());
      return retAttr;
    case 3:
      return "";
    default:
      return "";
  }
}

function anonymiseTimeString(timeStr: string, message: Message) {
  const date = new Date(timeStr);
  const newTime = anonymiseTime(date.getTime(), message);
  date.setTime(newTime);
  return date.toString();
}
