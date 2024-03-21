import { ModuleHandler } from "@/enums/handler.enum";
import { sendMessage } from "@/helper";
import { Any } from "@/types/any.type";
import { AdPosition, AdSize } from "@/types/handler/ads.type";
import { InMemoryModules } from "@/types/handler/module.type";
import { Logger } from "@/utils/log.util";

const adsScript = (function () {
  const CLOSE_TEXT = "Close this ad only";
  const FILTER_TEXT = "Forever on this site";

  const pauseOptions = ["15 minutes", "60 minutes", CLOSE_TEXT, FILTER_TEXT];

  const getAdLink = (id: string, width: number, height: number) => {
    const url = new URL("https://swashapp.io/user/ads/view");
    url.searchParams.set("id", id);
    url.searchParams.set("w", width.toString());
    url.searchParams.set("h", height.toString());

    return url.toString();
  };

  const onPause = async (value: string) => {
    let time, until;
    switch (value) {
      case CLOSE_TEXT:
        break;
      case FILTER_TEXT:
        await sendMessage({
          obj: "preferences",
          func: "addAdsFilter",
          params: [window.location.href],
        });
        break;
      default:
        time = value.split(" ");
        until = +time[0];

        switch (time[1].toLocaleLowerCase()) {
          case "minute":
          case "minutes":
            until *= 60;
            break;
          case "hour":
          case "hours":
            until *= 3600;
            break;
          default:
            break;
        }

        await sendMessage({
          obj: "preferences",
          func: "pauseAd",
          params: [until],
        });
        break;
    }
  };

  const onClose = (parent: HTMLElement, div: HTMLDivElement) => {
    const element = parent.querySelector("#ad-container");

    if (element) {
      (element as HTMLElement).style.display = "none";

      const divInner = document.createElement("div");
      divInner.className = "sticky-ads-pause sticky-flex-center";

      divInner.innerHTML =
        '<div class="sticky-ads-pause-text">Pause your ads?</div>';

      for (const opt of pauseOptions) {
        const button = document.createElement("button");
        button.className = "sticky-ads-pause-button";
        button.innerHTML = opt;

        button.addEventListener("click", () => {
          onPause(opt);
          parent.style.display = "none";
        });

        divInner.appendChild(button);
      }

      div.addEventListener("click", () => {
        parent.style.display = "none";
      });

      parent.appendChild(divInner);
    }
  };

  const addStyles = () => {
    const style = document.createElement("style");
    style.innerHTML = `
      .sticky-flex-center {
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
        gap: 12px !important;
      }
    
      .sticky-ads-close {
        width: 16px !important;
        height: 16px !important;
        position: absolute !important;
        top: 0px !important;
        right: 0px !important;
        cursor: pointer !important;
        background-color: #B0AEAE !important;
      }
      
      .sticky-ads-pause {
        height: 100% !important;
      }
      
      .sticky-ads-pause,
      .sticky-ads-pause button {
        font-family: -apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji" !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        line-height: 20px !important;
        color: #24292E !important;
      }
      
      .sticky-ads-pause-text {
        text-align: center !important;
      }
      
      .sticky-ads-pause-button {
        appearance: none !important;
        background-color: #FAFBFC !important;
        border: 1px solid rgba(27, 31, 35, 0.15) !important;
        border-radius: 6px !important;
        box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset !important;
        box-sizing: border-box !important;
        cursor: pointer !important;
        display: inline-block !important;
        list-style: none !important;
        padding: 6px 16px !important;
        position: relative !important;
        transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1) !important;
        user-select: none !important;
        -webkit-user-select: none !important;
        touch-action: manipulation !important;
        vertical-align: middle !important;
        white-space: nowrap !important;
        word-wrap: break-word !important;
        margin: unset !important;
        text-decoration: none !important;
      }
      
      .sticky-ads-pause-button:hover {
        background-color: #F3F4F6 !important;
        text-decoration: none !important;
        transition-duration: 0.1s !important;
      }
      
      .sticky-ads-pause-button:disabled {
        background-color: #FAFBFC !important;
        border-color: rgba(27, 31, 35, 0.15) !important;
        color: #959DA5 !important;
        cursor: default !important;
      }
      
      .sticky-ads-pause-button:active {
        background-color: #EDEFF2 !important;
        box-shadow: rgba(225, 228, 232, 0.2) 0 1px 0 inset !important;
        transition: none 0s !important;
      }
      
      .sticky-ads-pause-button:focus {
        outline: 1px transparent !important;
      }
      
      .sticky-ads-pause-button:before {
        display: none !important;
      }
      
      .sticky-ads-pause-button:-webkit-details-marker {
        display: none !important;
      }
    `;

    document.querySelector("head")?.appendChild(style);
  };

  const createAdContainer = (
    name: string,
    placementId: string,
    size: AdSize,
  ) => {
    const div = document.createElement("div");
    div.id = `SwashAds${size.width}x${size.height}`;
    div.setAttribute("adName", name);
    div.style.width = `${size.width}px`;
    div.style.height = `${size.height}px`;
    div.style.direction = `ltr`;

    div.innerHTML = `<iframe id="ad-container" scrolling="no" title="ads" style="width: ${
      size.width
    }px; height: ${
      size.height
    }px; border: none; overflow: hidden;" src="${getAdLink(
      placementId,
      size.width,
      size.height,
    )}"></iframe>`;

    return div;
  };

  const addClose = (parent: HTMLElement) => {
    const div = document.createElement("div");
    div.className = "sticky-ads-close sticky-flex-center";
    div.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="#ffffff"><path d="M15.76 3.44a.773.773 0 0 0-1.12 0L9.6 8.48 4.56 3.44a.792.792 0 0 0-1.12 1.12L8.48 9.6l-5.04 5.04a.773.773 0 0 0 0 1.12A.726.726 0 0 0 4 16a.726.726 0 0 0 .56-.24l5.04-5.04 5.04 5.04a.773.773 0 0 0 1.12 0 .773.773 0 0 0 0-1.12L10.72 9.6l5.04-5.04a.773.773 0 0 0 0-1.12z" transform="translate(2 2)"></path></svg>';

    div.addEventListener("click", () => {
      onClose(parent, div);
    });

    parent.appendChild(div);
  };

  const addStickyAd = (
    name: string,
    placementId: string,
    size: AdSize,
    position: AdPosition,
  ) => {
    const div = createAdContainer(name, placementId, size);
    const { top, right, bottom, left } = position;

    div.style.background = "rgb(245, 245, 245)";
    div.style.position = "fixed";
    div.style.zIndex = `${Number.MAX_SAFE_INTEGER}`;
    if (top) div.style.top = `${top}px`;
    if (right) div.style.right = `${right}px`;
    if (bottom) div.style.bottom = `${bottom}px`;
    if (left) div.style.left = `${left}px`;

    addClose(div);
    const body = document.querySelector("body");
    body?.insertBefore(div, body.firstChild);
  };

  const addEmbeddedAd = (
    name: string,
    selector: string,
    placementId: string,
    size: AdSize,
  ) => {
    const div = createAdContainer(name, placementId, size);
    div.style.margin = "auto";
    document.querySelector(selector)?.appendChild(div);
  };

  const handleResponse = async (
    modules: InMemoryModules<ModuleHandler.ADS>[],
  ) => {
    const body = document.querySelector("body");
    if (!body) {
      window.addEventListener("DOMContentLoaded", () => {
        handleResponse(modules);
      });
      return;
    }

    addStyles();

    for (const module of modules) {
      for (const item of module.items) {
        const { name, type, size } = item;

        const info = await sendMessage<{ uuid?: string }>({
          obj: "page",
          func: ModuleHandler.ADS,
          params: ["getAdSlot", item.size.width, item.size.height],
        });

        const placementId = info?.uuid;
        if (!placementId) continue;
        else if (type === "sticky")
          addStickyAd(name, placementId, size, item.position);
        else if (type === "embedded")
          addEmbeddedAd(name, item.selector, placementId, size);
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

if (!(window as Any).SwashAdsScript) {
  (window as Any).SwashAdsScript = true;

  sendMessage<InMemoryModules<ModuleHandler.ADS>[]>({
    obj: "page",
    func: ModuleHandler.ADS,
    params: ["getModules", window.location.href],
  }).then(adsScript.handleResponse, adsScript.handleError);
}
