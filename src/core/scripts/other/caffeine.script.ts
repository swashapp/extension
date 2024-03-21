import { runtime } from 'webextension-polyfill';

import { Any } from '../../../types/any.type';

if (!(window as Any).SwashCaffeineScript) {
  (window as Any).SwashCaffeineScript = true;

  setInterval(async () => {
    await runtime.sendMessage({
      obj: 'caffeine',
      func: '',
      params: [],
    });
    console.log(`Wake up Swash, you should stay awake!!!`);
  }, 3000);
}
