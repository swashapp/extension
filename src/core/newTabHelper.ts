import {
  DateTime,
  NewTab,
  SearchEngine,
  UnsplashResponse,
} from '../types/storage/new-tab.type';

import { configManager } from './configManager';
import { storageHelper } from './storageHelper';

const unsplashProxy = 'https://d34s39bh8oxiy5.cloudfront.net';

const newTabHelper = (function () {
  let newTabConfig: NewTab;
  const unsplashImages: UnsplashResponse[] = [];
  async function init() {
    newTabConfig = await configManager.getConfig('newTab');
  }

  async function getConfig() {
    return await storageHelper.getNewTab();
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

  async function setBackground(background: string) {
    const db = await storageHelper.getNewTab();
    db.background = background;
    await storageHelper.saveNewTab(db);
  }

  async function getUnsplashImage(width: string) {
    if (unsplashImages.length < 3) {
      const url = new URL(`${unsplashProxy}/photos/random`);
      url.searchParams.set('count', '30');
      url.searchParams.set('w', width);

      const res = await fetch(url.toString());
      const body = await res.json();

      body.forEach((item: any) => {
        console.log(item);
        unsplashImages.push({
          src: item.urls.raw,
          copyright: {
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

  async function setSearchEngine(searchEngine: SearchEngine) {
    const db = await storageHelper.getNewTab();
    db.searchEngine = searchEngine;
    await storageHelper.saveNewTab(db);
  }

  async function setDatetime(datetime: DateTime) {
    const db = await storageHelper.getNewTab();
    db.datetime = datetime;
    await storageHelper.saveNewTab(db);
  }
  async function getDatetime() {
    return (await storageHelper.getNewTab()).datetime;
  }

  return {
    init,
    getConfig,
    addSite,
    setBackground,
    getUnsplashImage,
    setSearchEngine,
    setDatetime,
    getDatetime,
  };
})();

export { newTabHelper };
