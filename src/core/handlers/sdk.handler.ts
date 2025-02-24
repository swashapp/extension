import { windows } from "webextension-polyfill";

import { BaseScriptHandler } from "@/core/base/script.handler";
import { DeviceType } from "@/enums/api.enum";
import { INTERNAL_PATHS } from "@/paths";
import {
  getAppName,
  getAppVersion,
  getExtensionURL,
  getSystemInfo,
  openInNewTab,
} from "@/utils/browser.util";

export class SdkHandler extends BaseScriptHandler {
  private popupFlag = true;

  constructor() {
    super();
    this.scripts = ["/core/scripts/sdk.script.js"];

    this.getVersion = this.getVersion.bind(this);
    this.openProfilePage = this.openProfilePage.bind(this);
    this.openPopupPage = this.openPopupPage.bind(this);
  }

  public async load() {
    await this.addScriptsListener();
  }

  public async unload() {
    await this.removeScriptsListener();
  }

  public async getVersion() {
    const info = await getSystemInfo();
    return {
      device: DeviceType.EXTENSION,
      os: info.osName,
      app: getAppName(),
      version: getAppVersion(),
    };
  }

  public async openProfilePage() {
    await openInNewTab(getExtensionURL(INTERNAL_PATHS.profile));
  }

  public async openPopupPage() {
    if (this.popupFlag) {
      this.popupFlag = false;
      const url = getExtensionURL("/ui/popup.html");
      const current = await windows.getCurrent();
      const all = await windows.getAll({
        populate: true,
        windowTypes: ["popup"],
      });

      let window = all.find((item) => item.tabs && item.tabs[0].url === url);
      if (window && window.id) {
        window.focused = true;
        await windows.update(window.id, {
          drawAttention: true,
          focused: true,
        });
      } else {
        const width = 370;
        const height = 570;
        const top = current.top;
        const left = current.left;
        window = await windows.create({
          type: "popup",
          url,
          height,
          width,
          left,
          top,
        });
        if (window.id)
          await windows.update(window.id, {
            drawAttention: true,
            focused: true,
            height,
            width,
            left,
            top,
          });
      }
      setTimeout(() => (this.popupFlag = true), 1000);
    }
  }
}
