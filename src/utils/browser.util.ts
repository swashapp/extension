import browser from 'webextension-polyfill';

const browserUtils = (function () {
  function getUserAgent() {
    return navigator.userAgent;
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

  return {
    getUserAgent,
    getBrowserLanguage,
    getPlatformInfo,
    getVersion,
    isMobileDevice,
  };
})();

export { browserUtils };
