import { sendMessage } from "@/helper";
import { Any } from "@/types/any.type";
import { SdkMessageEvent } from "@/types/handler/sdk.type";
import { getExtensionURL } from "@/utils/browser.util";

const SdkScript = (function () {
  const init = () => {
    embed("core/scripts/inpage/sdk.script.js");
    addMessageHandler();
  };

  const sendResponse = (event: SdkMessageEvent, data: Any) => {
    (event.source as Window)?.postMessage(
      { func: `${event.data.func}Resp`, response: data },
      event.origin,
    );
  };

  const embed = (path: string) => {
    const url = getExtensionURL(path);
    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", url);
    document.documentElement.appendChild(script);
  };

  const addMessageHandler = () => {
    window.addEventListener("message", async (event: SdkMessageEvent) => {
      try {
        const data = await sendMessage(event.data);
        sendResponse(event, data);
      } catch (error: Any) {
        sendResponse(event, {
          error: error.message || "Something unexpected happened",
        });
      }
    });
  };

  return {
    init,
  };
})();

if (!(window as Any).SwashSDKScript) {
  (window as Any).SwashSDKScript = true;

  SdkScript.init();
}
