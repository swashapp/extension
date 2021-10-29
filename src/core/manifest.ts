import browser from 'webextension-polyfill';

const ssConfig = (function () {
  return {
    name: browser.runtime.getManifest().name,
    description: browser.runtime.getManifest().description,
    path: '/',
    is_enabled: true,
    privacyLevel: 'auto',
    homepage_url: browser.runtime.getManifest().homepage_url,
    version: browser.runtime.getManifest().version,
  };
})();
export { ssConfig };
