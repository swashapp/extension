import { windows } from 'webextension-polyfill';

import { InternalPaths } from '../../paths';
import {
  getAppVersion,
  getExtensionURL,
  openInNewTab,
} from '../../utils/browser.util';
import { BaseScriptHandler } from '../base/script.handler';

export class SdkHandler extends BaseScriptHandler {
  private popupFlag = true;

  constructor() {
    super();
    this.scripts = ['/scripts/sdk.script.js'];
  }

  async load() {
    await this.addScriptsListener();
  }

  async unload() {
    await this.removeScriptsListener();
  }

  async getVersion() {
    return getAppVersion();
  }

  async openProfilePage() {
    await openInNewTab(getExtensionURL(InternalPaths.profile));
  }

  async openPopupPage() {
    if (this.popupFlag) {
      this.popupFlag = false;
      const url = getExtensionURL('/ui/popup.html');
      const current = await windows.getCurrent();
      const all = await windows.getAll({
        populate: true,
        windowTypes: ['popup'],
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
        const height = 450;
        const top = current.top;
        const left = current.left;
        window = await windows.create({
          url,
          type: 'popup',
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

  private async addScriptsListener() {}
}
