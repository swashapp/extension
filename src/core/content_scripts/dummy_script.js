import browser from 'webextension-polyfill';

setInterval(() => {
  browser.runtime.sendMessage({
    obj: 'dummy',
    func: '',
    params: [],
  });
}, 5000);
