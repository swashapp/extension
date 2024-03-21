import { RequestMethod } from "@/enums/api.enum";
import { MatchType } from "@/enums/pattern.enum";
import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["*://*.yahoo.com/*"];

export const YahooModule: OnDiskModule = {
  description:
    "This module Captures a user search queries, search results, and links clicked by the user for Yahoo",
  is_enabled: true,
  anonymity_level: 1,
  privacy_level: 0,

  browsing: {
    filter: { urls },
    extra_info_spec: [],
    items: [
      {
        name: "yahooQuery",
        title: "Search Query",
        description:
          "This item collects all search queries that a user enter in Yahoo search bar",
        is_enabled: true,
        hook: "webRequest",
        filter: {
          urls: ["*://*.yahoo.com/*"],
        },
        patterns: [
          {
            method: RequestMethod.GET,
            url_pattern:
              "https:\\/\\/((.*)\\.)?search\\.yahoo\\.com\\/search.*",
            pattern_type: MatchType.Regex,
            param: [
              {
                type: "query",
                key: "p",
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
        name: "yahooSearchResult",
        url_match: "*://*.yahoo.com/*",
        description:
          "This item collects Yahoo search results, search category, page number and corresponding search query",
        title: "Search Result",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "window",
            event_name: "load",
          },
        ],
        objects: [
          {
            selector: ".algo",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".compTitle div span",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".title",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".compText p",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: ".ads .compTitle",
            name: "adsResult",
            index_name: "rank",
            properties: [
              {
                selector: "a.ad-domain",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".title",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".compText p",
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
                selector: "#yschsp",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: ".compPagination strong",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
              {
                selector: ".compList.visible-pivots .active",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "yahooClickedLink",
        url_match: "*://*.yahoo.com/*",
        description:
          "This item collects links clicked by user from Yahoo search result",
        title: "clicked link",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".algo .compTitle",
            event_name: "click",
          },
          {
            selector: ".algo .compTitle",
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
                selector: "div span",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".title a",
                property: "innerText",
                name: "title",
                type: "text",
              },
            ],
          },
          {
            selector: ".algo",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".compTitle div span",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".title",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".compText p",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: ".ads .compTitle",
            name: "adsResult",
            index_name: "rank",
            properties: [
              {
                selector: "a.ad-domain",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".title",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".compText p",
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
                selector: "#yschsp",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: ".compPagination strong",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
              {
                selector: ".compList.visible-pivots .active",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "yahooAdsClickedLink",
        url_match: "*://*.yahoo.com/*",
        description:
          "This item collects links clicked by user from Yahoo search result",
        title: "Ads clicked link",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".ads .compTitle",
            event_name: "click",
          },
          {
            selector: ".ads .compTitle",
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
                selector: ".ad-domain",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".title a",
                property: "innerText",
                name: "title",
                type: "text",
              },
            ],
          },
          {
            selector: ".algo",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".compTitle div span",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".title",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".compText p",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: ".ads .compTitle",
            name: "adsResult",
            index_name: "rank",
            properties: [
              {
                selector: "a.ad-domain",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".title",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".compText p",
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
                selector: "#yschsp",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: ".compPagination strong",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
              {
                selector: ".compList.visible-pivots .active",
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
        name: "yahooSearchResult",
        url_match: "*://*.yahoo.com/*",
        description:
          "This item collects Yahoo search results, search category, page number and corresponding search query",
        title: "Search Result",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "window",
            event_name: "load",
          },
        ],
        objects: [
          {
            selector: ".algo",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".compTitle div span",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".title",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".compText p",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: ".ads",
            name: "adsResult",
            index_name: "rank",
            properties: [
              {
                selector: ".compText.tad-url a",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".compText.tad-title a",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".compText.tad-abst",
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
                selector: "#p",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: ".tab.selected .tab-wrapper",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "yahooClickedLink",
        url_match: "*://*.yahoo.com/*",
        description:
          "This item collects links clicked by user from Yahoo search result",
        title: "clicked link",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".algo .compTitle",
            event_name: "click",
          },
          {
            selector: ".algo .compTitle",
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
                selector: "div span",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".title a",
                property: "innerText",
                name: "title",
                type: "text",
              },
            ],
          },
          {
            selector: ".algo",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".compTitle div span",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".title",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".compText p",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: ".ads",
            name: "adsResult",
            index_name: "rank",
            properties: [
              {
                selector: ".compText.tad-url a",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".compText.tad-title a",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".compText.tad-abst",
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
                selector: "#p",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: ".tab.selected .tab-wrapper",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "yahooAdsClickedLink",
        url_match: "*://*.yahoo.com/*",
        description:
          "This item collects links clicked by user from Yahoo search result",
        title: "Ads clicked link",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".ads .s-titleHdr",
            event_name: "click",
          },
          {
            selector: ".ads .s-titleHdr",
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
                selector: ".compText.tad-url a",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".compText.tad-title a",
                property: "innerText",
                name: "title",
                type: "text",
              },
            ],
          },
          {
            selector: ".algo",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".compTitle div span",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".title",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".compText p",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: ".ads",
            name: "adsResult",
            index_name: "rank",
            properties: [
              {
                selector: ".compText.tad-url a",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: ".compText.tad-title a",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".compText.tad-abst",
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
                selector: "#p",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: ".tab.selected .tab-wrapper",
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
