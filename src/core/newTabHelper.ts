import browser, { Tabs } from 'webextension-polyfill';

import { NewTab } from '../types/storage/new-tab.type';

import { configManager } from './configManager';
import { storageHelper } from './storageHelper';

const newTabHelper = (function () {
  let newTabConfig: NewTab;
  async function init() {
    newTabConfig = await configManager.getConfig('newTab');
    return;
  }

  function newTabListener(tab: Tabs.Tab) {
    if (
      tab.url === 'chrome://newtab/' ||
      tab.url === 'edge://newtab/' ||
      tab.url === 'about:newtab'
    ) {
      browser.tabs.update(tab.id, {
        url: browser.runtime.getURL('/new-tab/index.html'),
      });
    }
  }

  async function updateStatus(status: boolean) {
    const db = await storageHelper.getNewTab();
    db.status = status;
    await storageHelper.saveNewTab(db);

    if (status) browser.tabs.onCreated.addListener(newTabListener);
    else if (browser.tabs.onCreated.hasListener(newTabListener)) {
      browser.tabs.onCreated.removeListener(newTabListener);
    }
  }

  async function getStatus() {
    return (await storageHelper.getNewTab()).status;
  }

  async function addSite(
    rank: number,
    title: string,
    url: string,
    icon: string,
  ) {
    const db = await storageHelper.getNewTab();
    db.sites[rank] = { title, url, icon };
    await storageHelper.saveNewTab(db);
  }
  async function getSites() {
    return (await storageHelper.getNewTab()).sites;
  }

  async function setBackground(background: string) {
    const db = await storageHelper.getNewTab();
    db.background = background;
    await storageHelper.saveNewTab(db);
  }

  async function getBackground() {
    return (await storageHelper.getNewTab()).background;
  }

  return {
    init,
    updateStatus,
    getStatus,
    addSite,
    getSites,
    setBackground,
    getBackground,
  };
})();

export { newTabHelper };
