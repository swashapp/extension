import { RequestMethod } from "@/enums/api.enum";
import { MatchType } from "@/enums/pattern.enum";
import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["*://*.baidu.com/*"];

export const BaiduModule: OnDiskModule = {
  description:
    "This module Captures a user search queries, search results, and links clicked by the user for Baidu",
  is_enabled: true,
  anonymity_level: 1,
  privacy_level: 0,

  browsing: {
    filter: { urls },
    extra_info_spec: [],
    items: [
      {
        name: "baiduQuery",
        title: "Search Query",
        description:
          "This item collects all search queries that a user enter in Baidu search bar",
        is_enabled: false,
        hook: "webRequest",
        filter: {
          urls,
        },
        patterns: [
          {
            method: RequestMethod.GET,
            url_pattern:
              "http[s]?:\\/\\/(.*)\\.baidu\\.com\\/([sfqim]\\?|sf\\/|search).*",
            pattern_type: MatchType.Regex,
            param: [
              {
                type: "query",
                key: "wd",
                name: "query",
              },
              {
                type: "query",
                key: "kw",
                name: "query",
              },
              {
                type: "query",
                key: "word",
                name: "query",
              },
              {
                type: "regex",
                group: 1,
                name: "category",
              },
              {
                type: "referrer",
                name: "link",
                default: "about:blank",
              },
            ],
            schems: [
              {
                jpath: "$.query",
                type: "text",
              },
              {
                jpath: "$.category",
                type: "text",
              },
              {
                jpath: "$.link",
                type: "url",
              },
            ],
          },
        ],
      },
    ],
  },
  content: {
    mapping: {
      win: PlatformType.Desktop,
      mac: PlatformType.Desktop,
      ios: PlatformType.Mobile,
      ipados: PlatformType.Desktop,
      linux: PlatformType.Desktop,
      android: PlatformType.Mobile,
      cros: PlatformType.Desktop,
      openbsd: PlatformType.Desktop,
      unknown: PlatformType.Desktop,
    },
    url_matches: urls,
    desktop: [
      {
        name: "baiduSearchResult",
        url_match: "*://*.baidu.com/*",
        description:
          "This item collects Baidu search results, search category, page number and corresponding search query",
        title: "Search Result",
        type: "event",
        ready_at: "DOMChange",
        observing_target_node: "#wrapper_wrapper",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        is_enabled: true,
        events: [
          {
            selector: ".",
            event_name: ".",
          },
        ],
        objects: [
          {
            selector: ".result",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".f13 a",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".t",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".c-abstract",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: "body",
            properties: [
              {
                selector: "#kw",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: "#page .pc",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
              {
                selector: ".s_tab_inner b",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "baiduClickedLink",
        url_match: "*://*.baidu.com/*",
        description:
          "This item collects links clicked by user from Baidu search result",
        title: "clicked link",
        type: "event",
        is_enabled: true,
        ready_at: "DOMChange",
        observing_target_node: "#wrapper_wrapper",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        events: [
          {
            selector: ".result",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "#",
            properties: [
              {
                property: "index",
                name: "rank",
                type: "text",
              },
            ],
          },
          {
            selector: "",
            properties: [
              {
                selector: ".f13 a",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".t",
                property: "innerText",
                name: "title",
                type: "text",
              },
            ],
          },
          {
            selector: ".result",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".f13 a",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".t",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".c-abstract",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: "body",
            properties: [
              {
                selector: "#kw",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: "#page .pc",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
              {
                selector: ".s_tab_inner b",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
        ],
      },
    ],
    mobile: [
      {
        name: "baiduSearchResult",
        url_match: "*://*.baidu.com/*",
        description:
          "This item collects Baidu search results, search category, page number and corresponding search query",
        title: "Search Result",
        type: "event",
        ready_at: "DOMChange",
        observing_target_node: "#page",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        is_enabled: true,
        events: [
          {
            selector: ".",
            event_name: ".",
          },
        ],
        objects: [
          {
            selector: ".result",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".c-result-content .c-showurl",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".c-result-content .c-title-text",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".c-result-content .c-line-clamp3",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: "body",
            properties: [
              {
                selector: "#kw",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: ".new-nowpage i",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
              {
                selector: ".se-tabitem .se-tab-cur",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "baiduClickedLink",
        url_match: "*://*.baidu.com/*",
        description:
          "This item collects links clicked by user from Baidu search result",
        title: "clicked link",
        type: "event",
        is_enabled: true,
        ready_at: "DOMChange",
        observing_target_node: "#wrapper_wrapper",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        events: [
          {
            selector: ".result",
            event_name: "click",
          },
        ],
        objects: [
          {
            selector: "#",
            properties: [
              {
                property: "index",
                name: "rank",
                type: "text",
              },
            ],
          },
          {
            selector: "",
            properties: [
              {
                selector: ".c-result-content .c-showurl",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".c-result-content .c-title-text",
                property: "innerText",
                name: "title",
                type: "text",
              },
            ],
          },
          {
            selector: ".result",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".c-result-content .c-showurl",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".c-result-content .c-title-text",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".c-result-content .c-line-clamp3",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: "body",
            properties: [
              {
                selector: "#kw",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: ".new-nowpage i",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
              {
                selector: ".se-tabitem .se-tab-cur",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
        ],
      },
    ],
  },
};
