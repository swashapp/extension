import browser from 'webextension-polyfill';

import { Any } from '../types/any.type';

const browserUtils = (function () {
  function getUserAgent() {
    return navigator.userAgent;
  }

  function isSafari() {
    const status = getUserAgent().toLowerCase().indexOf('safari') > -1;
    console.log(`Safari check: ${status}`);
    return status;
  }

  function getBrowserLanguage() {
    return navigator.language;
  }

  async function getPlatformInfo() {
    if (navigator.platform && navigator.platform.startsWith('Win'))
      return { os: 'win' };
    const platformInfoPromise = browser.runtime.getPlatformInfo();
    return platformInfoPromise
      .then((platformInfo) => {
        return platformInfo;
      })
      .catch((err) => {
        console.log(err);
        return { os: 'android' };
      });
  }

  async function isMobileDevice() {
    const os = (await getPlatformInfo()).os;
    return os === 'android';
  }

  function getVersion() {
    return browser.runtime.getManifest().version;
  }

  function getManifestVersion() {
    return browser.runtime.getManifest().manifest_version;
  }

  async function injectScript(tabId: number, files: string[]) {
    if (getManifestVersion() === 2) {
      for (const file of files)
        await browser.tabs.executeScript(tabId, {
          file: file,
          allFrames: false,
          runAt: 'document_start',
        });
    } else {
      await browser.scripting.executeScript({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        injectImmediately: true,
        target: { tabId, allFrames: false },
        files,
      });
    }
  }

  function setBrowserIcon(items: Any) {
    if (getManifestVersion() === 2) {
      browser.browserAction.setIcon(items);
    } else {
      browser.action.setIcon(items);
    }
  }

  return {
    getUserAgent,
    isSafari,
    getBrowserLanguage,
    getPlatformInfo,
    getVersion,
    isMobileDevice,
    getManifestVersion,
    injectScript,
    setBrowserIcon,
  };
})();

export { browserUtils };
