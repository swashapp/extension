// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import browser from 'webextension-polyfill';

import { browserUtils } from '../../utils/browser.util';

const transfer = (function () {
  const pattern = 'swash://*';
  const regexp = 'swash://(0x[a-fA-F0-9]{40})';

  function initModule(module) {}

  function showPageOnTab(url_to_show) {
    return browser.windows
      .getAll({
        populate: true,
        windowTypes: ['normal'],
      })
      .then((windowInfoArray) => {
        browser.tabs.create({ url: url_to_show, active: true }).then((x) => {
          window.close();
        });
      });
  }

  function openTransferDialog(wallet) {
    const url = browser.runtime.getURL(
      'dashboard/index.html#/Transfer/' + wallet,
    );
    return browser.windows.create({
      url: url,
      type: 'popup',
    });
  }
  function listener(requestDetails) {
    const res = requestDetails.url.match(regexp);
    const url = browser.runtime.getURL(
      'dashboard/index.html#/Transfer/' + res[1],
    );
    showPageOnTab(url);
  }

  function load() {
    if (!browser.webRequest.onBeforeRequest.hasListener(listener)) {
      browser.webRequest.onBeforeRequest.addListener(
        listener,
        { urls: [pattern] },
        ['blocking'],
      );
    }

    if (browser.tabs.onUpdated.hasListener(registerContentScripts))
      browser.tabs.onUpdated.removeListener(registerContentScripts);
    browser.tabs.onUpdated.addListener(registerContentScripts);
  }

  function unload() {
    if (browser.tabs.onUpdated.hasListener(registerContentScripts))
      browser.tabs.onUpdated.removeListener(registerContentScripts);

    if (browser.webRequest.onBeforeRequest.hasListener(listener)) {
      browser.webRequest.onBeforeRequest.removeListener(listener);
    }
  }

  function registerContentScripts(tabId, changeInfo) {
    if (changeInfo.status == 'loading') {
      browserUtils
        .injectScript(tabId, [
          '/lib/browser-polyfill.js',
          '/core/content_scripts/transfer_script.js',
        ])
        .catch((err) => {
          console.error(err);
        });
    }
  }

  return {
    load,
    unload,
    initModule,
    openTransferDialog,
  };
})();
export { transfer };
