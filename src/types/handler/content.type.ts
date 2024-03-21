export type EventCollectorConditions = {
  type:
    | "previousSibling"
    | "nextSibling"
    | "parent"
    | "child"
    | "ancestor"
    | "descendant";
  contain: boolean;
  val: string;
};

type ObjectProperty = {
  name: string;
  type: "text" | "number" | "boolean" | "url";
  selector?: string;
  property?: string;
  function?: string;
  arrIndex?: number;

  // TODO: should revise these attributes deeply
  is_required?: boolean;
  category?: string;
};

export type EventCollectorEvent = {
  event_name: string;
  selector: string;
  conditions?: EventCollectorConditions[][];
  key_code?: number;
};

type EventCollectorObject = {
  selector: string;
  is_required?: boolean;
  name?: string;
  index_name?: string;
  conditions?: EventCollectorConditions[][];
  properties: ObjectProperty[];
};

export type ContentEventCollector = {
  type: "event";
  ready_at?: "windowLoad" | "DOMChange" | "windowChange" | "DOMLoad";
  observing_target_node?: string;
  observing_config?: MutationObserverInit;
  events: EventCollectorEvent[];
  objects: EventCollectorObject[];
};

export type ContentLogCollector = {
  type: "log";
  level?: "error" | "warn" | "log";
};

export type ContentCollector = { url_match: string } & (
  | ContentEventCollector
  | ContentLogCollector
);
