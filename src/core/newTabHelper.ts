import browser, { Tabs } from 'webextension-polyfill';

import { NewTab, UnsplashResponse } from '../types/storage/new-tab.type';

import { configManager } from './configManager';
import { storageHelper } from './storageHelper';

const newTabHelper = (function () {
  let newTabConfig: NewTab;
  const unsplashImages: UnsplashResponse[] = [];
  async function init() {
    newTabConfig = await configManager.getConfig('newTab');
    await updateListener();
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

  async function updateListener() {
    const db = await storageHelper.getNewTab();

    if (db.status) browser.tabs.onCreated.addListener(newTabListener);
    else if (browser.tabs.onCreated.hasListener(newTabListener)) {
      browser.tabs.onCreated.removeListener(newTabListener);
    }
  }

  async function updateStatus(status: boolean) {
    const db = await storageHelper.getNewTab();
    db.status = status;
    await storageHelper.saveNewTab(db);

    await updateListener();
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

  async function getUnsplashImage(width: string) {
    if (unsplashImages.length < 3) {
      const url = new URL('https://api.unsplash.com/photos/random');
      url.searchParams.set('count', '30');
      url.searchParams.set('w', width);

      const res = await fetch(url.toString(), {
        headers: {
          Authorization: `Client-ID oreT5F-CEO3BsJuOu8OUD9w1a-9Q5My0yXWa4MJqbsE`,
        },
      });
      const body = await res.json();

      body.forEach((item: any) => {
        unsplashImages.push({
          src: item.urls.raw,
          credit: {
            imageLink: item.links.html,
            location: item.location ? item.location.title : null,
            userName: item.user.name,
            userLink: item.user.links.html,
          },
        });
      });
    }

    return unsplashImages.pop();
  }

  return {
    init,
    updateStatus,
    getStatus,
    addSite,
    getSites,
    setBackground,
    getBackground,
    getUnsplashImage,
  };
})();

export { newTabHelper };
