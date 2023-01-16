import { NewTab, UnsplashResponse } from '../types/storage/new-tab.type';

import { configManager } from './configManager';
import { storageHelper } from './storageHelper';

const newTabHelper = (function () {
  let newTabConfig: NewTab;
  const unsplashImages: UnsplashResponse[] = [];
  async function init() {
    newTabConfig = await configManager.getConfig('newTab');
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
      const url = new URL(
        'https://d34s39bh8oxiy5.cloudfront.net/photos/random',
      );
      url.searchParams.set('count', '30');
      url.searchParams.set('w', width);

      const res = await fetch(url.toString());
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
    addSite,
    getSites,
    setBackground,
    getBackground,
    getUnsplashImage,
  };
})();

export { newTabHelper };
