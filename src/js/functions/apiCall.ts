// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { JSONPath } from 'jsonpath-plus';

import { browserUtils } from '../browserUtils';
import { configManager } from '../configManager';
import { dataHandler } from '../dataHandler';
import { storageHelper } from '../storageHelper';
import { utils } from '../utils';

// TODO: handle ETAG
// TODO: handle batch requests
const apiCall = (function () {
  const callbacks = [];
  const extId = 'authsaz@gmail.com';
  let apiCallConfig;
  let API_CALL_INTERVAL;
  let DELAY_BETWEEN_CALLS;

  function init() {
    apiCallConfig = configManager.getConfig('apiCall');
    if (apiCallConfig) {
      API_CALL_INTERVAL = apiCallConfig.interval;
      DELAY_BETWEEN_CALLS = apiCallConfig.delay;
    }
  }

  function initModule(module) {
    if (module.functions.includes('apiCall'))
      module.apiCall.apiConfig.redirect_url = getCallBackURL(module.name);
  }

  function getCallBackURL(moduleName) {
    const cbURL =
      'https://callbacks.swashapp.io/' +
      sha256(extId) +
      '/' +
      moduleName.toLowerCase();
    return cbURL;
  }

  async function isConnected(moduleName) {
    const modules = await storageHelper.retrieveModules();
    for (const moduleN in modules) {
      const module = modules[moduleN];
      if (module.name == moduleName) {
        if (module.apiCall.access_token && module.apiCall.access_token != '')
          return true;
        return false;
      }
    }
  }
  function startOauth(moduleName) {
    const filter = {
      urls: ['https://callbacks.swashapp.io/*'],
    };
    if (!browser.webRequest.onBeforeRequest.hasListener(extractToken))
      browser.webRequest.onBeforeRequest.addListener(extractToken, filter);
    storageHelper.retrieveModules().then((modules) => {
      for (const moduleN in modules) {
        const module = modules[moduleN];
        if (module.name == moduleName) {
          const auth_url = `${module.apiCall.apiConfig.auth_url}?client_id=${
            module.apiCall.apiConfig.client_id
          }&response_type=token&redirect_uri=${encodeURIComponent(
            module.apiCall.apiConfig.redirect_url,
          )}&state=345354345&scope=${encodeURIComponent(
            module.apiCall.apiConfig.scopes.join(' '),
          )}`;
          return browserUtils.isMobileDevice().then((result) => {
            if (result) {
              return browser.tabs.create({
                url: auth_url,
              });
            }
            return browser.windows.create({
              url: auth_url,
              type: 'popup',
            });
          });
        }
      }
    });
  }

  function extractToken(details) {
    storageHelper.retrieveModules().then((modules) => {
      for (const moduleN in modules) {
        const module = modules[moduleN];
        if (module.functions.includes('apiCall')) {
          //let urlObj = new URL(details.url);
          if (details.url.startsWith(getCallBackURL(moduleN))) {
            const rst = details.url.match(
              module.apiCall.apiConfig.access_token_regex,
            );
            if (rst) {
              saveAccessToken(module, rst[1]);
            }
            browser.tabs.remove(details.tabId);
          }
        }
      }
    });

    return null;
  }
  function saveAccessToken(module, token) {
    const data = {};
    data[module.name] = { apiCall: {} };
    data[module.name].apiCall.access_token = token;
    storageHelper.updateModules(data);
  }

  function getAccessToken(moduleName) {
    return storageHelper.retrieveModules().then((mds) => {
      for (const m in mds) {
        if (mds[m].name == moduleName) {
          if (validateToken(mds[m]))
            return { token: mds[m].apiCall.access_token, module: mds[m] };
          return { token: '', module: mds[m] };
        }
      }
      return { token: '', module: {} };
    });
  }

  function prepareMessage(response, module, data) {
    try {
      return response.json();
    } catch {
      return {};
    }
  }

  function getEtag(response) {
    return response.headers.get('ETag');
  }

  function saveEtags(module_name, eTags) {
    storageHelper.retrieveModules().then((modules) => {
      const data = {};
      data[module_name] = {};
      data[module_name].apiCall = modules[module_name].apiCall;
      for (const aapi of data[module_name].apiCall.items) {
        aapi.etag = eTags[aapi.name];
      }
      storageHelper.updateModules(data);
      // TODO: review when concorent saveEtags called, what will done!
    });
  }

  function purgeAccessToken(module) {
    saveAccessToken(module, null);
    // TODO notify token has expired
  }

  function validateToken(module) {
    if (module.apiCall.access_token) {
      const apiInfo = module.apiCall.validate_token;
      apiInfo.params = {};
      apiInfo.params[apiInfo.token_param_name] = module.apiCall.access_token;

      return apiCall(
        module.apiCall.validate_token.endpoint,
        apiInfo,
        module.apiCall.access_token,
      )
        .then((response) => {
          if (response.status != 200) {
            purgeAccessToken(module);
            return false;
          }
          return response
            .json()
            .then((json) => {
              const jpointers = JSONPath({
                path: module.apiCall.validate_token.required_jpath,
                json: json,
              });
              if (jpointers.length > 0) {
                return true;
              } else {
                purgeAccessToken(module);
                return false;
              }
            })
            .catch((error) => {
              purgeAccessToken(module);
            });
        })
        .catch((error) => {
          purgeAccessToken(module);
        });
    }
    return false;
  }

  function apiCall(endpoint, apiInfo, access_token) {
    let url = endpoint + apiInfo.URI;
    const req = {
      method: apiInfo.method,
      headers: {
        'Content-Type': apiInfo.content_type,
      },
    };
    if (apiInfo.headers) {
      for (const key in apiInfo.headers) {
        if (apiInfo.headers.hasOwnProperty(key)) {
          req.headers[key] = apiInfo.headers[key];
        }
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
        data = utils.serialize(apiInfo.params);
        break;
      case 'application/json':
        data = JSON.stringify(apiInfo.params);
        break;
      case 'multipart/form-data':
        var formData = new FormData();
        for (const p in apiInfo.params)
          if (apiInfo.params.hasOwnProperty(p)) {
            formData.append(
              encodeURIComponent(p),
              encodeURIComponent(apiInfo.params[p]),
            );
          }
        data = formData;
        break;
      default:
        data = utils.serialize(apiInfo.params);
    }

    switch (apiInfo.method) {
      case 'GET':
        url = url.concat('?', data);
        break;
      case 'POST':
        req.body = data;
        break;
    }

    return fetch(url, req);
  }

  function unload() {
    storageHelper.retrieveModules().then((modules) => {
      for (const module in modules) {
        if (modules[module].functions.includes('apiCall')) {
          unloadModule(modules[module]);
        }
      }
    });
  }

  function load() {
    storageHelper.retrieveModules().then((modules) => {
      for (const module in modules) {
        if (modules[module].functions.includes('apiCall')) {
          loadModule(modules[module]);
        }
      }
    });
  }

  function sendMessage(module, data, msg) {
    dataHandler.handle({
      origin: module.apiCall.apiConfig.api_endpoint + data.URI,
      header: {
        function: 'apiCall',
        module: module.name,
        collector: data.name,
      },
      data: {
        out: msg,
        schems: data.schems,
      },
    });
  }

  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  function fetchApis(moduleName) {
    const etags = {};
    getAccessToken(moduleName)
      .then((resp) => {
        if (resp.token) {
          let i = 0;
          resp.module.apiCall.items.forEach((data) => {
            if (data.is_enabled) {
              var s = setTimeout(function () {
                callbacks[moduleName].apiCalls = utils.arrayRemove(
                  callbacks[moduleName].apiCalls,
                  s,
                );
                apiCall(
                  resp.module.apiCall.apiConfig.api_endpoint,
                  data,
                  resp.token,
                )
                  .then((q) => {
                    const et = getEtag(q);
                    etags[data.name] = et;
                    return prepareMessage(q);
                  })
                  .then((msg) => {
                    sendMessage(resp.module, data, msg);
                  });
              }, DELAY_BETWEEN_CALLS * i);
              i++;
              callbacks[moduleName].apiCalls.push(s);
            }
          });
        }
      })
      .then((a) => {
        if (!utils.isEmpty(etags)) saveEtags(resp.module.name, etags);
      });
  }

  function unloadModule(module) {
    if (module.functions.includes('apiCall')) {
      if (callbacks[module.name]) {
        clearInterval(callbacks[module.name].interval);
        if (callbacks[module.name].apiCalls) {
          for (const s of callbacks[module.name].apiCalls) clearTimeout(s);
        }
      }
      callbacks[module.name] = {};
    }
  }

  function loadModule(module) {
    unloadModule(module);
    if (module.is_enabled) {
      if (module.functions.includes('apiCall')) {
        fetchApis(module.name);
        const crURL = getCallBackURL(module.name);
        callbacks[module.name] = { interval: -1, apiCalls: [] };
        callbacks[module.name].interval = setInterval(function (x) {
          fetchApis(module.name);
        }, API_CALL_INTERVAL);
      }
    }
  }

  return {
    init,
    initModule,
    load,
    unload,
    unloadModule,
    loadModule,
    startOauth,
    getCallBackURL,
    isConnected,
  };
})();
export { apiCall };
