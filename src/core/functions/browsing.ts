// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import browser from 'webextension-polyfill';

import { commonUtils } from '../../utils/common.util';
import { dataHandler } from '../dataHandler';
import { storageHelper } from '../storageHelper';

const browsing = (function () {
  'use strict';

  const callbacks = {};

  function initModule(module) {}

  function inspectStatusCode(moduleName, data, requestDetails) {}
  function inspectReferrer(moduleName, data, requestDetails, origin) {
    if (
      requestDetails.type != 'main_frame' ||
      (!requestDetails.originUrl && !requestDetails.initiator)
    )
      return;
    const message = {
      origin: origin,
      header: {
        function: 'browsing',
        module: moduleName,
        collector: data.name,
      },
      data: {
        out: {
          url: requestDetails.url,
          originUrl: requestDetails.originUrl || requestDetails.initiator,
        },
        schems: [
          { jpath: '$.url', type: 'url' },
          { jpath: '$.originUrl', type: 'url' },
        ],
      },
    };
    return message;
  }

  function inspectVisit(moduleName, data, requestDetails) {
    if (requestDetails.type != 'main_frame') return;
    const message = {
      origin: requestDetails.url,
      header: {
        function: 'browsing',
        module: moduleName,
        collector: data.name,
      },
      data: {
        out: {
          url: requestDetails.url,
        },
        schems: [{ jpath: '$.url', type: 'url' }],
      },
    };
    return message;
  }

  function inspectRequest_patterns(moduleName, data, requestDetails) {
    for (const patt of data.patterns) {
      const d = inspectRequest_pattern(
        moduleName,
        data.name,
        patt,
        requestDetails,
      );
      if (d != null && Object.keys(d).length > 0) {
        // we suppose one of the methods will return a value
        return d;
      }
    }
  }

  function inspectRequest_pattern(moduleName, data_name, patt, requestDetails) {
    if (requestDetails.method != patt.method) {
      return null;
    }
    let failed = true;
    if (patt.pattern_type === 'regex') {
      var res = requestDetails.url.match(patt.url_pattern);
      if (res != null) {
        failed = false;
      }
    }
    if (patt.pattern_type === 'wildcard') {
      var res = commonUtils.wildcard(requestDetails.url, patt.url_pattern);
      if (res != null) failed = false;
    }
    if (patt.pattern_type === 'exact') {
      if (requestDetails.url == patt.url_pattern) {
        failed = false;
      }
    }
    if (!failed) {
      const retval = {};
      patt.param.forEach((p) => {
        let val = null;
        if (p.type === 'regex') {
          if (res[p.group]) val = decodeURIComponent(res[p.group]);
        }
        if (p.type === 'form') {
          if (requestDetails.requestBody.formData[p.key])
            val = decodeURIComponent(
              requestDetails.requestBody.formData[p.key],
            );
        }
        if (p.type === 'query') {
          if (new URL(requestDetails.url).searchParams.get(p.key))
            val = decodeURIComponent(
              new URL(requestDetails.url).searchParams.get(p.key),
            );
        }
        if (val) {
          retval[p.name] = val;
        } else {
          if (p.default) {
            retval[p.name] = p.default;
          }
        }
      });
      if (Object.keys(retval).length == 0) return;
      const message = {
        origin: requestDetails.url,
        header: {
          function: 'browsing',
          module: moduleName,
          collector: data_name,
        },
        data: {
          out: retval,
          /*schems: [
                            {jpath:"$.query",type:"text"},
                            {jpath:"$.category",type:"text"},
                        ]*/
          schems: patt.schems,
        },
      };
      return message;
    }
    return null;
  }

  function load() {
    storageHelper.getModules().then((modules) => {
      for (const module in modules) {
        loadModule(modules[module]);
      }
    });
  }

  function unload() {
    storageHelper.getModules().then((modules) => {
      for (const module in modules) {
        unloadModule(modules[module]);
      }
    });
  }

  function loadModule(module) {
    if (module.is_enabled) {
      if (module.functions.includes('browsing')) {
        module.browsing.items.forEach((data) => {
          if (data.is_enabled) {
            load_collector(module, data);
          }
        });
      }
    }
  }

  function unloadModule(module) {
    if (module.functions.includes('browsing')) {
      module.browsing.items.forEach((data) => {
        if (callbacks[module.name + '_' + data.name]) {
          unload_collector(module, data);
        }
      });
    }
  }

  function load_collector(module, data) {
    data.hook = data.hook ? data.hook : 'webRequest';
    switch (data.hook) {
      case 'webRequest':
        hook_webrequest(module, data);
        break;
      case 'bookmarks':
        hook_bookmarks(module, data);
        break;
      case 'response':
        hook_response(module, data);
        break;
    }
  }

  function unload_collector(module, data) {
    data.hook = data.hook ? data.hook : 'webRequest';
    switch (data.hook) {
      case 'webRequest':
        if (
          browser.webRequest.onBeforeRequest.hasListener(
            callbacks[module.name + '_' + data.name],
          )
        ) {
          browser.webRequest.onBeforeRequest.removeListener(
            callbacks[module.name + '_' + data.name],
          );
        }
        break;
      case 'bookmarks':
        if (
          browser.bookmarks.onCreated.hasListener(
            callbacks[module.name + '_' + data.name],
          )
        ) {
          browser.bookmarks.onCreated.removeListener(
            callbacks[module.name + '_' + data.name],
          );
        }
        if (
          browser.bookmarks.onChanged.hasListener(
            callbacks[module.name + '_' + data.name + '_change'],
          )
        ) {
          browser.bookmarks.onChanged.removeListener(
            callbacks[module.name + '_' + data.name + '_change'],
          );
        }
        break;
      case 'response':
        if (
          browser.webRequest.onHeadersReceived.hasListener(
            callbacks[module.name + '_' + data.name],
          )
        ) {
          browser.webRequest.onHeadersReceived.removeListener(
            callbacks[module.name + '_' + data.name],
          );
        }
        break;
    }
  }

  async function hook_webrequest(module, data) {
    callbacks[module.name + '_' + data.name] = async function (x) {
      if (x.tabId < 0) return;
      const local_data = data;
      let retval = null;
      if (
        !local_data.target_listener ||
        local_data.target_listener == 'inspectRequest'
      )
        retval = inspectRequest_patterns(module.name, local_data, x);
      if (local_data.target_listener == 'inspectReferrer') {
        const origin = (await browser.tabs.get(x.tabId)).url;
        retval = inspectReferrer(module.name, local_data, x, origin);
      }
      if (local_data.target_listener == 'inspectVisit')
        retval = inspectVisit(module.name, local_data, x);
      if (retval != null) dataHandler.handle(retval, x.tabId);
    };
    if (
      !browser.webRequest.onBeforeRequest.hasListener(
        callbacks[module.name + '_' + data.name],
      )
    ) {
      // default for filter and extraInfo
      const filter = data.filter
        ? data.filter
        : module.browsing.browsing_filter;
      const extraInfoSpec = data.extraInfoSpec
        ? data.extraInfoSpec
        : module.browsing.browsing_extraInfoSpec;
      browser.webRequest.onBeforeRequest.addListener(
        callbacks[module.name + '_' + data.name],
        filter,
        extraInfoSpec,
      );
    }
  }

  function hook_bookmarks(module, data) {
    callbacks[module.name + '_' + data.name] = function (id, bookmark) {
      dataHandler.handle({
        origin: bookmark.url,
        header: {
          function: 'browsing',
          module: module.name,
          collector: 'New Bookmark',
        },
        data: {
          out: {
            bookmark: bookmark,
          },
          schems: [
            { jpath: '$.bookmark.id', type: 'id' },
            { jpath: '$.bookmark.parentId', type: 'id' },
            { jpath: '$.bookmark.title', type: 'text' },
            { jpath: '$.bookmark.dateAdded', type: 'date' },
            { jpath: '$.bookmark.url', type: 'url' },
          ],
        },
      });
    };
    if (
      !browser.bookmarks.onCreated.hasListener(
        callbacks[module.name + '_' + data.name],
      )
    ) {
      browser.bookmarks.onCreated.addListener(
        callbacks[module.name + '_' + data.name],
      );
    }

    callbacks[module.name + '_' + data.name + '_change'] = function (
      id,
      changeInfo,
    ) {
      changeInfo.id = id;
      dataHandler.handle({
        origin: changeInfo.url,
        header: {
          function: 'browsing',
          module: module.name,
          collector: 'New Bookmark',
        },
        data: {
          out: {
            bookmark: changeInfo,
          },
          schems: [
            { jpath: '$.bookmark.title', type: 'text' },
            { jpath: '$.bookmark.url', type: 'url' },
            { jpath: '$.bookmark.id', type: 'id' },
          ],
        },
      });
    };
    if (
      !browser.bookmarks.onChanged.hasListener(
        callbacks[module.name + '_' + data.name + '_change'],
      )
    ) {
      browser.bookmarks.onChanged.addListener(
        callbacks[module.name + '_' + data.name + '_change'],
      );
    }
  }

  function hook_response(module, data) {
    callbacks[module.name + '_' + data.name] = function (details) {
      const local_data = data;
      let matched = false;
      for (const pattern of local_data.pattern) {
        if (details.statusCode == pattern.statusCode) {
          matched = true;
          break;
        }
      }
      if (matched) {
        dataHandler.handle(
          {
            origin: details.url,
            header: {
              function: 'browsing',
              module: module.name,
              collector: local_data.name,
            },
            data: {
              out: {
                statusCode: details.statusCode,
                url: details.url,
              },
              schems: [
                { jpath: '$.statusCode', type: 'text' },
                { jpath: '$.url', type: 'url' },
              ],
            },
          },
          details.tabId,
        );
      }
    };
    if (
      !browser.webRequest.onHeadersReceived.hasListener(
        callbacks[module.name + '_' + data.name],
      )
    ) {
      const filter = data.filter
        ? data.filter
        : module.browsing.browsing_filter;
      browser.webRequest.onHeadersReceived.addListener(
        callbacks[module.name + '_' + data.name],
        filter,
      );
    }
  }

  return {
    initModule,
    load,
    unload,
    unloadModule,
    loadModule,
  };
})();
export { browsing };
