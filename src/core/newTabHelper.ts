import { NewTab } from '../types/storage/new-tab.type';

import { configManager } from './configManager';
import { storageHelper } from './storageHelper';

const newTabHelper = (function () {
  let newTabConfig: NewTab;
  async function init() {
    newTabConfig = await configManager.getConfig('newTab');
    return;
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
    addSite,
    getSites,
    setBackground,
    getBackground,
  };
})();

export { newTabHelper };
