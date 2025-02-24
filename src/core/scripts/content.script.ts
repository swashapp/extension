import { ModuleHandler } from "@/enums/handler.enum";
import { sendMessage } from "@/helper";
import { Any } from "@/types/any.type";
import { HelperMessage } from "@/types/app.type";
import {
  ContentCollector,
  ContentEventCollector,
  ContentLogCollector,
  EventCollectorConditions,
  EventCollectorEvent,
} from "@/types/handler/content.type";
import { CollectorBase, InMemoryModules } from "@/types/handler/module.type";
import { Logger } from "@/utils/log.util";
import { createMessageHeader } from "@/utils/message.util";
import { isEmpty } from "@/utils/object.util";

const ContentScript = (() => {
  const callbacks: Record<string, Any> = {};
  const observerCallbacks: Record<string, Any> = {};

  const getPropertyValue = (obj: Any, propertyPath: string): Any => {
    return propertyPath
      .split(".")
      .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  };

  const selectElements = (
    node: Element | Document = document,
    selector: string,
    all: boolean = false,
  ): Element | NodeListOf<Element> | null => {
    while (selector.startsWith("<") && node instanceof HTMLElement) {
      node = node.parentElement as Element;
      selector = selector.slice(1);
    }
    if (!selector) return node as Element | null;

    try {
      return all
        ? node.querySelectorAll(selector)
        : node.querySelector(selector);
    } catch (error) {
      Logger.error(`Invalid selector "${selector}":`, error);
      return null;
    }
  };

  const relationCheckers: Record<
    string,
    (el: Element, selector: string) => boolean
  > = {
    previousSibling: (el, sel) => hasSibling(el, sel, "previous"),
    nextSibling: (el, sel) => hasSibling(el, sel, "next"),
    parent: (el, sel) => hasParent(el, sel),
    child: (el, sel) => hasChild(el, sel),
    ancestor: (el, sel) => hasAncestor(el, sel),
    descendant: (el, sel) => hasDescendant(el, sel),
  };

  const hasSibling = (
    element: Element,
    selector: string,
    direction: "previous" | "next",
  ): boolean => {
    let sibling =
      direction === "previous"
        ? element.previousElementSibling
        : element.nextElementSibling;
    while (sibling) {
      if (sibling.matches(selector)) return true;
      sibling =
        direction === "previous"
          ? sibling.previousElementSibling
          : sibling.nextElementSibling;
    }
    return false;
  };

  const hasParent = (element: Element, selector: string): boolean => {
    let parent = element.parentElement;
    while (parent) {
      if (parent.matches(selector)) return true;
      parent = parent.parentElement;
    }
    return false;
  };

  const hasChild = (element: Element, selector: string): boolean => {
    return Array.from(element.children).some((child) =>
      child.matches(selector),
    );
  };

  const hasAncestor = (element: Element, selector: string): boolean => {
    return hasParent(element, selector);
  };

  const hasDescendant = (element: Element, selector: string): boolean => {
    return !!element.querySelector(selector);
  };

  const isCollectable = (
    element: Element,
    conditions: EventCollectorConditions[][],
  ): boolean => {
    return conditions.some((conditionGroup) =>
      conditionGroup.every((condition) => {
        const checker = relationCheckers[condition.type];
        return checker
          ? condition.contain
            ? checker(element, condition.val)
            : !checker(element, condition.val)
          : false;
      }),
    );
  };

  const publicCallback = async (
    module: InMemoryModules<ModuleHandler.CONTENT>,
    item: CollectorBase<ContentEventCollector>,
    event: Event,
    index: number,
  ): Promise<void> => {
    const message: HelperMessage = {
      obj: "data",
      func: "collect",
      params: [
        {
          origin: window.location.href,
          header: createMessageHeader("content", item.name, module),
          data: {
            out: {} as Record<string, Any>,
            schems: [] as Array<{ jpath: string; type: string }>,
          },
        },
      ],
    };

    item.objects.forEach((obj) => {
      let selected;
      let elements: Element[];

      switch (obj.selector) {
        case "#":
          elements = [{ ...eventInfo(index) }] as Any;
          break;
        case "window":
          elements = [window] as Any;
          break;
        case "document":
          elements = [document] as Any;
          break;
        case "":
          elements = [event.currentTarget as Element];
          break;
        case ".":
          elements = [event.target as Element];
          break;
        default:
          selected = obj.name
            ? selectElements(document, obj.selector, true)
            : selectElements(document, obj.selector, false);
          elements =
            selected instanceof NodeList
              ? Array.from(selected)
              : selected
                ? [selected]
                : [];
          break;
      }

      if (elements.length === 0 && obj.is_required) return;

      elements.forEach((el) => {
        if (obj.conditions && !isCollectable(el, obj.conditions)) return;

        if (obj.name) {
          message.params[0].data.out[obj.name] =
            message.params[0].data.out[obj.name] || [];
          obj.properties.forEach((prop) => {
            message.params[0].data.schems.push({
              jpath: `$.${obj.name}[*].${prop.name}`,
              type: prop.type,
            });
            if (obj.index_name) {
              message.params[0].data.schems.push({
                jpath: `$.${obj.name}[*].${obj.index_name}`,
                type: "text",
              });
            }
          });

          const item: Record<string, Any> = {};
          obj.properties.forEach((prop) => {
            const target = prop.selector
              ? selectElements(el, prop.selector, !!prop.arrIndex)
              : el;
            const value =
              prop.function === "getBoundingClientRect" &&
              el instanceof HTMLElement
                ? el.getBoundingClientRect()
                : getPropertyValue(target, prop.property!);
            if (value !== undefined) {
              item[prop.name] = value;
            }
          });

          if (!isEmpty(item)) {
            if (obj.index_name) {
              item[obj.index_name] =
                message.params[0].data.out[obj.name].length + 1;
            }
            message.params[0].data.out[obj.name].push(item);
          }
        } else {
          obj.properties.forEach((prop) => {
            const {
              name,
              type,
              selector,
              arrIndex,
              function: func,
              property,
            } = prop;

            message.params[0].data.schems.push({
              jpath: `$.${name}`,
              type,
            });

            let targetElement: Element | null = el;

            if (selector) {
              const isArrayIndex = arrIndex !== undefined;
              const selected = selectElements(el, selector, isArrayIndex);

              if (selected instanceof NodeList) {
                if (isArrayIndex) targetElement = selected?.[arrIndex];
              } else {
                targetElement = selected;
              }
            }

            let value: Any | undefined;

            if (func === "getBoundingClientRect" && el instanceof HTMLElement) {
              value = el.getBoundingClientRect();
            } else if (targetElement) {
              value = getPropertyValue(targetElement, property!);
            }

            if (value !== undefined) {
              message.params[0].data.out[name] = value;
            }
          });
        }
      });
    });

    if (!isEmpty(message.params[0].data.out)) await sendMessage(message);
  };

  const eventInfo = (index: number) => ({ index: index + 1 });

  const handleDOMReady = (
    event: EventCollectorEvent,
    callback: (e: Event, index: number) => void,
  ): void => {
    const elements = selectElements(document, event.selector, true);
    if (!(elements instanceof NodeList)) return;

    elements.forEach((el, index) => {
      if (event.conditions && !isCollectable(el, event.conditions)) return;
      el.addEventListener(event.event_name, (e: Event) => callback(e, index));
    });
  };

  const observeDOMChanges = (
    event: EventCollectorEvent,
    callback: (e: Event, index: number) => void,
    collector: CollectorBase<ContentEventCollector>,
    callbackName: string,
  ): void => {
    let targetNode = selectElements(
      document,
      collector.observing_target_node || "",
      false,
    );
    if (!targetNode) return;
    if (targetNode instanceof NodeList) targetNode = targetNode[0];

    const observer = new MutationObserver(() => {
      const elements = selectElements(document, event.selector, true);
      if (!(elements instanceof NodeList)) return;

      elements.forEach((el, idx) => {
        if (event.conditions && !isCollectable(el, event.conditions)) return;
        if (!observerCallbacks[`${callbackName}${idx}`]) {
          const cb = (e: Event) => callback(e, idx);
          observerCallbacks[`${callbackName}${idx}`] = cb;
          el.addEventListener(event.event_name, cb);
        }
      });
    });

    observer.observe(targetNode, collector.observing_config || {});
  };

  const exportLog = (
    level: "error" | "warn" | "log",
    module: InMemoryModules<ModuleHandler.CONTENT>,
    item: CollectorBase<ContentLogCollector>,
  ): void => {
    const scriptContent = `
      (${overrideDebug.toString()})('${level}', '${JSON.stringify(
        module,
      )}', ${JSON.stringify(item)});
    `;
    const script = document.createElement("script");
    script.textContent = scriptContent;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
  };

  const overrideDebug = async (
    msg: Any,
    level: "error" | "warn" | "log",
    module: InMemoryModules<ModuleHandler.CONTENT>,
    item: CollectorBase<ContentCollector>,
  ): Promise<void> => {
    const message: HelperMessage = {
      obj: "data",
      func: "collect",
      params: [
        {
          origin: window.location.href,
          header: createMessageHeader("content", item.name, module),
          data: {
            out: {
              method: level,
              arguments: msg,
            },
            schems: [
              { jpath: "$.arguments", type: "text" },
              { jpath: "$.method", type: "text" },
            ],
          },
        },
      ],
    };
    await sendMessage(message);
    console[level](msg);
  };

  const handleLogItem = (
    module: InMemoryModules<ModuleHandler.CONTENT>,
    collector: CollectorBase<ContentLogCollector>,
  ): void => {
    const logLevels: Record<string, "error" | "warn" | "log"> = {
      ConsoleErrors: "error",
      ConsoleWarns: "warn",
      ConsoleLogs: "log",
    };
    const level = logLevels[collector.name];
    if (level) exportLog(level, module, collector);
  };

  const handleEventItem = (
    module: InMemoryModules<ModuleHandler.CONTENT>,
    item: CollectorBase<ContentEventCollector>,
  ): void => {
    item.events.forEach((event) => {
      const callback = (e: Event, index: number) => {
        if (!event.key_code || event.key_code === (e as Any).keyCode) {
          publicCallback(module, item, e, index);
        }
      };

      const callbackName = `${module.name}_${item.name}_${event.selector}_${event.event_name}`;
      callbacks[callbackName] = callback;

      if (["window", "document"].includes(event.selector)) {
        const target = event.selector === "window" ? window : document;
        target.addEventListener(
          event.event_name as keyof WindowEventMap | keyof DocumentEventMap,
          callback as EventListener,
        );
      } else {
        const readyEventMap: Record<string, () => void> = {
          windowLoad: () =>
            window.addEventListener("load", () =>
              handleDOMReady(event, callback),
            ),
          DOMChange: () =>
            window.addEventListener("DOMContentLoaded", () =>
              observeDOMChanges(event, callback, item, callbackName),
            ),
          windowChange: () =>
            window.addEventListener("load", () =>
              observeDOMChanges(event, callback, item, callbackName),
            ),
          DOMLoad: () =>
            window.addEventListener("DOMContentLoaded", () =>
              handleDOMReady(event, callback),
            ),
        };
        readyEventMap[item.ready_at || "DOMLoad"]();
      }
    });
  };

  const handleResponse = (
    modules: InMemoryModules<ModuleHandler.CONTENT>[] = [],
  ): void => {
    modules.forEach((module) => {
      module.items.forEach((item) => {
        switch (item.type) {
          case "event":
            handleEventItem(
              module,
              item as CollectorBase<ContentEventCollector>,
            );
            break;
          case "log":
            handleLogItem(module, item as CollectorBase<ContentLogCollector>);
            break;
          default:
            Logger.warn(`Unknown item type: ${JSON.stringify(item)}`);
        }
      });
    });
  };

  const handleError = (error: Any): void => {
    Logger.error("Content script error:", error);
  };

  return {
    handleResponse,
    handleError,
  };
})();

if (!(window as Any).SwashContentScript) {
  (window as Any).SwashContentScript = true;

  sendMessage<InMemoryModules<ModuleHandler.CONTENT>[]>({
    obj: "page",
    func: ModuleHandler.CONTENT,
    params: ["getModules", window.location.href],
  })
    .then(ContentScript.handleResponse)
    .catch(ContentScript.handleError);
}
