import { JSONPath } from 'jsonpath-plus';
import browser from 'webextension-polyfill';

import { ProfileEntity } from '../entities/profile.entity';
import { OnboardingPageValues } from '../enums/onboarding.enum';
import { Any } from '../types/any.type';
import {
  Onboarding,
  OnboardingFlow,
  OnboardingPage,
} from '../types/storage/onboarding.type';

import { browserUtils } from '../utils/browser.util';
import { commonUtils } from '../utils/common.util';

import { configManager } from './configManager';
import { loader } from './loader';
import { memberManager } from './memberManager';
import { storageHelper } from './storageHelper';
import { userHelper } from './userHelper';

const { serialize, sha256 } = commonUtils;

const onboarding = (function () {
  let oauthTabId = 0;
  let oauthWinId = 0;
  let parentId = 0;
  let obName = '';
  const extId = 'authsaz@gmail.com';

  let onboardingConfigs;
  let onboardingTools: Any = {};
  let onboardingFlow: OnboardingFlow;
  let isOnboardingOpened = false;

  async function init() {
    onboardingConfigs = await configManager.getConfig('onboarding');
    if (onboardingConfigs) onboardingTools = onboardingConfigs['tools'];
    if (onboardingConfigs) onboardingFlow = onboardingConfigs['flow'];
  }

  function getCallBackURL(onboardingName: string) {
    return (
      'https://callbacks.swashapp.io/' +
      sha256(extId) +
      '/' +
      onboardingName.toLowerCase()
    );
  }

  function isValidDB(db: Any) {
    return (
      db &&
      db.configs &&
      db.configs.salt &&
      db.profile &&
      db.profile.encryptedWallet
    );
  }

  async function isNeededOnBoarding() {
    const data: Onboarding = await storageHelper.getOnboarding();
    if (data == null || data.flow == null || !data.completed) return true;
    else if (data.flow.version < onboardingFlow.version) return true;
    return false;
  }

  function isNeededJoin() {
    return memberManager.isJoined() === false;
  }

  async function repeatOnboarding(
    pages: OnboardingPageValues[],
    clicked = false,
  ) {
    const data: Onboarding = await storageHelper.getOnboarding();
    if (data && data.completed != null) {
      for (const page in data.flow?.pages) {
        if (pages.includes(page)) onboardingFlow.pages[page]['visible'] = 'all';
        else onboardingFlow.pages[page]['visible'] = 'none';
      }
    }
    if (clicked || !isOnboardingOpened) await openOnBoarding();
  }

  function checkNotExistInDB(currentPage: OnboardingPage, data: Any) {
    if (typeof currentPage.visible === 'string' || !currentPage.visible['core'])
      return;
    const entities = currentPage.visible['core']['notExistInDB'].split('.');
    delete currentPage.visible['core']['notExistInDB'];
    if (entities.length === 0) return true;
    let _data = data;
    for (const entity of entities) {
      if (_data[entity] == null) return true;
      _data = _data[entity];
    }
    return false;
  }

  function shouldShowThisPage(currentPage: OnboardingPage, data: Any) {
    if (
      typeof currentPage.visible === 'object' &&
      currentPage.visible['core'] != null
    ) {
      for (const rule in currentPage.visible['core']) {
        if (rule === 'notExistInDB') {
          if (!checkNotExistInDB(currentPage, data)) return false;
        }
      }
      delete currentPage.visible['core'];
      if (currentPage.visible['ui'] == null) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete currentPage.visible;
        currentPage.visible = 'all';
      }
    }
    return true;
  }

  async function getOnboardingFlow() {
    const data = await storageHelper.getAll();
    const result = { ...onboardingFlow };
    for (const page in result.pages) {
      if (!shouldShowThisPage(result.pages[page], data)) {
        result.pages[page]['visible'] = 'none';
      }
    }
    return JSON.stringify(result);
  }

  async function submitOnBoarding() {
    isOnboardingOpened = false;
    await loader.install();
    const db = await storageHelper.getAll();

    if (!isValidDB(db)) return false;
    const onboarding = await storageHelper.getOnboarding();
    await storageHelper.saveOnboarding({
      ...onboarding,
      flow: onboardingFlow,
      completed: true,
    });
    await loader.onInstalled();
    userHelper.getUserCountry().then((location) => {
      console.log(`User is joined from ${location.country}`);
    });

    await storageHelper.getFilters();
    await storageHelper.getPrivacyData();

    return true;
  }

  async function startOnBoarding(onboardingName: string, tabId: number) {
    parentId = tabId;
    obName = onboardingName;
    const data = await storageHelper.getOnboarding();

    if (!browser.tabs.onRemoved.hasListener(handleRemoved)) {
      browser.tabs.onRemoved.addListener(handleRemoved);
    }

    if (
      !data[onboardingName] ||
      (await getOnBoardingAccessToken(onboardingName)) === ''
    ) {
      startOnBoardingOAuth(onboardingName).then((response) => {
        let tab = response;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (response.type === 'popup') tab = response.tabs[0];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        oauthTabId = tab.id;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        oauthWinId = tab.windowId;
      });
    } else {
      browser.tabs.sendMessage(parentId, { onboarding: obName }).then();
    }
  }

  function handleRemoved(tid: number, removeInfo: Any) {
    if (oauthTabId === tid && oauthWinId === removeInfo.windowId) {
      browser.tabs.onRemoved.removeListener(handleRemoved);
      browser.tabs.sendMessage(parentId, { onboarding: obName }).then();
    }
  }

  async function startOnBoardingOAuth(onboardingName: string) {
    const filter = {
      urls: ['https://callbacks.swashapp.io/*'],
    };
    if (
      !browser.webRequest.onBeforeRequest.hasListener(
        extractOnBoardingAccessToken,
      )
    )
      browser.webRequest.onBeforeRequest.addListener(
        extractOnBoardingAccessToken,
        filter,
      );
    for (const onboardingIndex in onboardingTools) {
      const onboarding = onboardingTools[onboardingIndex];
      if (onboarding.name === onboardingName) {
        onboarding.apiConfig.redirect_url = getCallBackURL(onboarding.name);
        const auth_url = `${onboarding.apiConfig.auth_url}?client_id=${
          onboarding.apiConfig.client_id
        }&response_type=token&redirect_uri=${encodeURIComponent(
          onboarding.apiConfig.redirect_url,
        )}&state=345354345&scope=${encodeURIComponent(
          onboarding.apiConfig.scopes.join(' '),
        )}`;
        if (await browserUtils.isMobileDevice()) {
          return browser.tabs.create({
            url: auth_url,
          });
        }
        const agent = browserUtils.getUserAgent();
        if (agent) {
          if (agent.match(/firefox|fxios/i)) {
            return browser.windows.create({
              url: auth_url,
              type: 'popup',
              allowScriptsToClose: true,
            });
          }
        }
        return browser.windows.create({
          url: auth_url,
          type: 'popup',
        });
      }
    }
  }

  function extractOnBoardingAccessToken(details: Any) {
    for (const onboardingIndex in onboardingTools) {
      const onboarding = onboardingTools[onboardingIndex];
      if (details.url.startsWith(getCallBackURL(onboarding.name))) {
        const rst = details.url.match(onboarding.apiConfig.access_token_regex);
        if (rst) {
          saveOnBoardingAccessToken(onboarding, rst[1]).then();
        }
        browser.tabs.remove(details.tabId).then();
      }
    }
  }

  async function saveOnBoardingAccessToken(onboarding: Any, token?: string) {
    const data: Any = await storageHelper.getOnboarding();
    data[onboarding.name] = {};
    data[onboarding.name].access_token = token;
    storageHelper.saveOnboarding(data).then();
  }

  async function getOnBoardingAccessToken(onboardingName: string) {
    const confs = await storageHelper.getOnboarding();
    for (const confIndex in confs) {
      const conf = confs[confIndex];
      if (confIndex === onboardingName) {
        if (await validateOnBoardingToken(onboardingName))
          return conf.access_token;
        return '';
      }
    }
    return '';
  }

  async function purgeOnBoardingAccessToken(onboardingName: string) {
    await saveOnBoardingAccessToken(onboardingName);
  }

  async function validateOnBoardingToken(onboardingName: string) {
    const data = await storageHelper.getOnboarding();
    const conf = data[onboardingName];

    for (const onboardingIndex in onboardingTools) {
      const onboarding = onboardingTools[onboardingIndex];
      if (onboardingName === onboarding.name) {
        if (conf.access_token) {
          const apiInfo = onboarding.validateToken;
          apiInfo.params = {};
          apiInfo.params[apiInfo.token_param_name] = conf.access_token;

          return apiCall(apiInfo, conf.access_token)
            .then(async (response) => {
              if (response.status !== 200) {
                await purgeOnBoardingAccessToken(onboarding);
                return false;
              }
              return response
                .json()
                .then(async (json) => {
                  const jPointers = JSONPath({
                    path: onboarding.validateToken.required_jpath,
                    json: json,
                  });
                  if (jPointers.length > 0) {
                    return true;
                  } else {
                    await purgeOnBoardingAccessToken(onboarding);
                    return false;
                  }
                })
                .catch(async () => {
                  await purgeOnBoardingAccessToken(onboarding);
                });
            })
            .catch(async () => {
              await purgeOnBoardingAccessToken(onboarding);
            });
        }
      }
    }

    return false;
  }

  function loadFile(file: Blob) {
    const temporaryFileReader = new FileReader();

    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException('Problem parsing input file.'));
      };

      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsText(file);
    });
  }

  async function applyConfig(config: string) {
    const oldDB = JSON.parse(config);

    if (isValidDB(oldDB)) {
      const configs = await storageHelper.getConfigs();
      const profile = await storageHelper.getProfile();

      configs.salt = oldDB.configs.salt;
      configs.delay = oldDB.configs.delay;
      profile.encryptedWallet = oldDB.profile.encryptedWallet;

      await storageHelper.mergeConfigs(configs);
      await storageHelper.mergeProfile(profile);
      await storageHelper.mergePrivacyData(oldDB.privacyData);
      await storageHelper.mergeFilters(oldDB?.filters);
      await storageHelper.mergeCharities(oldDB?.charity);
      await storageHelper.mergeAdsConfig(oldDB?.ads);
      await storageHelper.mergeNewTab(oldDB?.newTab);
      await storageHelper.mergeStates(oldDB?.state);

      await userHelper.loadSavedWallet();
      return true;
    }
    return false;
  }

  function createConfigFile(text: string) {
    return new Blob([text], { type: 'application/octet-stream' });
  }

  async function saveConfig() {
    function blobToBase64(blob: Blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    }

    const db = await storageHelper.getAll();
    const data = createConfigFile(JSON.stringify(db));
    const url = await blobToBase64(data);
    const currentDate = new Date().toISOString().slice(0, 10);
    browser.downloads
      .download({
        url: url,
        filename: 'swash-' + currentDate + '.conf',
        saveAs: true,
      })
      .then();
  }

  async function getFilesList(onboardingName: string) {
    const data = await storageHelper.getOnboarding();
    const conf = data[onboardingName];

    for (const onboardingIndex in onboardingTools) {
      const onboarding = onboardingTools[onboardingIndex];
      if (onboardingName === onboarding.name) {
        const getListApi = onboarding.apiCall.listFiles;

        const response = await apiCall(getListApi, conf.access_token);
        if (response.status === 200) return response.json();
        return false;
      }
    }
    return false;
  }

  async function downloadFile(onboardingName: string, fileId: string) {
    const data = await storageHelper.getOnboarding();
    const conf = data[onboardingName];

    for (const onboardingIndex in onboardingTools) {
      const onboarding = onboardingTools[onboardingIndex];
      if (onboardingName === onboarding.name) {
        const getFileApi = onboarding.apiCall.downloadFile;

        getFileApi.fileId = fileId;
        if (onboardingName === 'GoogleDrive') {
          getFileApi.params = {
            alt: 'media',
          };
        }
        if (onboardingName === 'DropBox') {
          getFileApi.headers['Dropbox-API-Arg'] = {
            path: fileId,
          };
        }

        const response = await apiCall(getFileApi, conf.access_token);
        if (response.status === 200) return response.json();
        return false;
      }
    }
    return false;
  }

  async function uploadFile(onboardingName: string) {
    const data = await storageHelper.getOnboarding();
    const conf = data[onboardingName];

    for (const onboardingIndex in onboardingTools) {
      const onboarding = onboardingTools[onboardingIndex];
      if (onboardingName === onboarding.name) {
        const db = await storageHelper.getAll();
        const uploadFileApi = onboarding.apiCall.uploadFile;

        const currentDate = new Date().toISOString().slice(0, 19);
        const fileContent = JSON.stringify(db);
        const file = createConfigFile(fileContent);
        const metadata = {
          name: 'swash-' + currentDate + '.conf',
          mimeType: 'text/plain',
        };

        if (onboardingName === 'DropBox')
          uploadFileApi.headers['Dropbox-API-Arg'].path =
            '/swash-' + currentDate + '.conf';

        const form = new FormData();
        form.append(
          'metadata',
          new Blob([JSON.stringify(metadata)], { type: 'application/json' }),
        );
        form.append('file', file);

        uploadFileApi.form = form;
        uploadFileApi.file = fileContent;

        const response = await apiCall(uploadFileApi, conf.access_token);
        if (response.status === 200) return response.json();
        return false;
      }
    }
    return false;
  }

  function apiCall(apiInfo: Any, access_token: string) {
    let url = apiInfo.URI;
    const req: Any = {
      method: apiInfo.method,
      headers: {
        'Content-Type': apiInfo.content_type,
      },
    };
    if (apiInfo.headers) {
      for (const key in apiInfo.headers) {
        req.headers[key] = JSON.stringify(apiInfo.headers[key]);
      }
    }
    if (access_token) {
      if (apiInfo.bearer) {
        req.headers['Authorization'] = 'Bearer '.concat(access_token);
      } else {
        apiInfo.params.access_token = access_token;
      }
    }
    let data = '';
    switch (apiInfo.content_type) {
      case 'application/x-www-form-urlencoded':
        data = serialize(apiInfo.params);
        break;
      case 'application/json':
        data = JSON.stringify(apiInfo.params);
        break;
      case 'multipart/form-data':
        delete req.headers['Content-Type'];
        data = apiInfo.form;
        break;
      case 'application/octet-stream':
        data = apiInfo.file;
        break;
      default:
        data = serialize(apiInfo.params);
    }

    switch (apiInfo.method) {
      case 'GET':
        if (apiInfo.fileId) {
          url = url.concat('/', apiInfo.fileId);
        }
        url = url.concat('?', data);
        break;
      case 'POST':
        req.body = data;
        break;
    }

    return fetch(url, req);
  }

  async function openOnBoarding() {
    const profile = await (await ProfileEntity.getInstance()).get();
    if (profile.encryptedWallet) await userHelper.loadSavedWallet();

    if (!isOnboardingOpened) {
      const fullURL = browser.runtime.getURL(
        'dashboard/index.html#/onboarding',
      );
      browser.tabs
        .create({
          url: fullURL,
        })
        .catch(console.log);
    }
    isOnboardingOpened = true;
  }

  async function saveProfileInfo(gender: string, age: string, income: string) {
    const data = await storageHelper.getProfile();
    try {
      data.gender = gender;
      data.age = age;
      data.income = income;
      await storageHelper.saveProfile(data);
    } catch (err) {
      console.error(
        `Could not to save user profile: ${gender} ${age} ${income}`,
      );
      console.error(`Error message: ${err.message}`);
    }
  }

  async function createAndSaveWallet() {
    const configs = await storageHelper.getConfigs();
    const profile = await storageHelper.getProfile();
    await userHelper.createWallet();
    if (configs.salt) {
      profile.encryptedWallet = await userHelper.getEncryptedWallet(
        configs.salt,
      );
    }
    return storageHelper.saveProfile(profile);
  }

  async function importAndSaveWallet(privateKey: string) {
    const configs = await storageHelper.getConfigs();
    const profile = await storageHelper.getProfile();
    await userHelper.importWallet(privateKey);
    if (configs.salt) {
      profile.encryptedWallet = await userHelper.getEncryptedWallet(
        configs.salt,
      );
    }
    return storageHelper.saveProfile(profile);
  }

  return {
    init,
    isNeededOnBoarding,
    isNeededJoin,
    getOnboardingFlow,
    submitOnBoarding,
    startOnBoarding,
    startOnBoardingOAuth,
    loadFile,
    applyConfig,
    saveConfig,
    getFilesList,
    downloadFile,
    uploadFile,
    openOnBoarding,
    saveProfileInfo,
    createAndSaveWallet,
    importAndSaveWallet,
    repeatOnboarding,
  };
})();
export { onboarding };
