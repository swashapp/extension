import { RequestMethod } from "@/enums/api.enum";
import { MatchType } from "@/enums/pattern.enum";
import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["*://duckduckgo.com/*"];

export const DuckDuckGoModule: OnDiskModule = {
  description:
    "This module Captures a user search queries, search results, and links clicked by the user for DuckDuckGo",
  is_enabled: true,
  anonymity_level: 1,
  privacy_level: 0,

  browsing: {
    filter: { urls },
    extra_info_spec: [],
    items: [
      {
        name: "duckduckgoQuery",
        title: "Search Query",
        description:
          "This item collects all search queries that a user enter in DuckDuckGo search bar",
        is_enabled: true,
        hook: "webRequest",
        filter: {
          urls,
        },
        patterns: [
          {
            method: RequestMethod.GET,
            url_pattern:
              "https:\\/\\/duckduckgo\\.com\\/((i|news|v)\\.js)?\\?.*",
            pattern_type: MatchType.Regex,
            param: [
              {
                type: "query",
                key: "q",
                name: "query",
              },
              {
                type: "regex",
                group: 2,
                name: "category",
                default: "web",
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
      ios: PlatformType.Desktop,
      ipados: PlatformType.Desktop,
      linux: PlatformType.Desktop,
      android: PlatformType.Desktop,
      cros: PlatformType.Desktop,
      openbsd: PlatformType.Desktop,
      unknown: PlatformType.Desktop,
    },
    url_matches: urls,
    desktop: [
      {
        name: "duckduckgoSearchResult",
        url_match: "*://duckduckgo.com/?*",
        description:
          "This item collects DuckDuckGo search results, search category, page number and corresponding search query",
        title: "Search Result",
        type: "event",
        ready_at: "DOMChange",
        observing_target_node: ".results--main",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        is_enabled: true,
        events: [
          {
            event_name: ".",
            selector: ".",
          },
        ],
        objects: [
          {
            selector: ".results .result.results_links_deep",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".result__body .result__title a",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: ".result__body .result__title a",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".result__body .result__snippet",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: ".results--ads .result.results_links",
            name: "adsResult",
            index_name: "rank",
            properties: [
              {
                selector:
                  ".result__body .result__extras .result__extras__url a",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".result__body .result__title a",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".result__body .result__snippet",
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
                selector: "#search_form_input",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: "#duckbar_static .zcm__item a.is-active",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "duckduckgoClickedLink",
        url_match: "*://duckduckgo.com/?*",
        description:
          "This item collects links clicked by user from DuckDuckGo search result",
        title: "clicked link",
        type: "event",
        ready_at: "DOMChange",
        observing_target_node: ".results--main",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        is_enabled: true,
        events: [
          {
            selector: ".results .result.results_links_deep",
            event_name: "click",
          },
          {
            selector: ".results .result.results_links_deep",
            event_name: "contextmenu",
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
                selector: ".result__body .result__title a",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: ".result__body .result__title a",
                property: "innerText",
                name: "title",
                type: "text",
              },
            ],
          },
          {
            selector: ".results .result.results_links_deep",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".result__body .result__title a",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: ".result__body .result__title a",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".result__body .result__snippet",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: ".results--ads .result.results_links",
            name: "adsResult",
            index_name: "rank",
            properties: [
              {
                selector:
                  ".result__body .result__extras .result__extras__url a",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".result__body .result__title a",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".result__body .result__snippet",
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
                selector: "#search_form_input",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: "#duckbar_static .zcm__item a.is-active",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "duckduckgoAdsClickedLink",
        url_match: "*://duckduckgo.com/*",
        description:
          "This item collects advertising links clicked by user from DuckDuckGo search result",
        title: "Ads clicked link",
        ready_at: "DOMChange",
        observing_target_node: ".results--main",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".results--ads .result.results_links",
            event_name: "click",
          },
          {
            selector: ".results--ads .result.results_links",
            event_name: "contextmenu",
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
                selector: ".result__body .result__title a",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: ".result__body .result__title a",
                property: "innerText",
                name: "title",
                type: "text",
              },
            ],
          },
          {
            selector: ".results .result.results_links_deep",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".result__body .result__title a",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: ".result__body .result__title a",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".result__body .result__snippet",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: ".results--ads .result.results_links",
            name: "adsResult",
            index_name: "rank",
            properties: [
              {
                selector:
                  ".result__body .result__extras .result__extras__url a",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".result__body .result__title a",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".result__body .result__snippet",
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
                selector: "#search_form_input",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: "#duckbar_static .zcm__item a.is-active",
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
