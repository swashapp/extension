import { ModuleHandler } from "@/enums/handler.enum";
import { sendMessage } from "@/helper";
import { Any } from "@/types/any.type";
import { AjaxCollector } from "@/types/handler/ajax.type";
import { CollectorBase, InMemoryModules } from "@/types/handler/module.type";
import { Logger } from "@/utils/log.util";

const AjaxScript = (function () {
  function handleEvent(item: CollectorBase<AjaxCollector>) {
    for (const event of item.events) {
      const listener = async () => {
        await sendMessage({
          obj: "page",
          func: ModuleHandler.AJAX,
          params: ["record", item.timeframe],
        });
      };

      if (event.object === "window") {
        window.addEventListener(event.event_name, listener);
      } else {
        const allElements = document.querySelectorAll(event.selector);
        for (let i = 0; i < allElements.length; i++) {
          allElements[i].addEventListener(event.event_name, listener);
        }
      }
    }
  }

  const handleResponse = (modules: InMemoryModules<ModuleHandler.AJAX>[]) => {
    for (const module of modules) {
      for (const item of module.items) {
        handleEvent(item);
      }
    }
  };

  const handleError = (error: Any) => {
    Logger.error(`Error: ${error}`);
  };

  return {
    handleResponse,
    handleError,
  };
})();

if (!(window as Any).SwashAjaxScript) {
  (window as Any).SwashAjaxScript = true;

  sendMessage<InMemoryModules<ModuleHandler.AJAX>[]>({
    obj: "page",
    func: ModuleHandler.AJAX,
    params: ["getModules", window.location.href],
  }).then(AjaxScript.handleResponse, AjaxScript.handleError);
}
