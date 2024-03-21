import { WebRequest } from "webextension-polyfill";

import { RequestMethod } from "@/enums/api.enum";
import { MatchType } from "@/enums/pattern.enum";
import { Any } from "@/types/any.type";

import { FilterBaseItem } from "./module.type";

export type WebRequestCollectorPattern = {
  method: RequestMethod;
  pattern_type: MatchType;
  url_pattern: string;
  param: Array<{
    type: "regex" | "form" | "query" | "link" | "referrer";
    key?: string;
    group?: number;
    name: string;
    default?: Any;
  }>;
  schems: { jpath: string; type: string }[];
};

export type ResponseCollectorPattern = {
  status_code: number;
};

export type WebRequestCollector = {
  hook: "webRequest";
  patterns?: WebRequestCollectorPattern[];
  target_listener?: "inspectRequest" | "inspectReferrer" | "inspectVisit";
} & FilterBaseItem<WebRequest.OnBeforeRequestOptions>;

export type ResponseCollector = {
  hook: "response";
  patterns?: ResponseCollectorPattern[];
} & FilterBaseItem<WebRequest.OnBeforeRequestOptions>;

export type BookmarkCollector = {
  hook: "bookmarks";
};

export type BrowsingCollector =
  | WebRequestCollector
  | ResponseCollector
  | BookmarkCollector;
