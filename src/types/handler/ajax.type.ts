import { WebRequest } from "webextension-polyfill";

import { FilterBaseItem } from "./module.type";

type AjaxEvent = {
  event_name: string;
} & (
  | { object: "element" | "document"; selector: string }
  | { object: "window" }
);

type BaseCollector = {
  hook: "webRequest";
  timeframe: number;
  events: AjaxEvent[];
};

export type AjaxCollector = BaseCollector &
  FilterBaseItem<WebRequest.OnCompletedOptions>;
