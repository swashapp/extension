import { RequestMethod } from "@/enums/api.enum";
import { MatchType } from "@/enums/pattern.enum";
import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["*://www.ask.com/*"];

export const AskModule: OnDiskModule = {
  description:
    "This module Captures a user search queries, search results, and links clicked by the user for top 7 search engines: Google, Bing, Yahoo, AOL, Ask, Baidu, and DuckDuckGo",
  is_enabled: true,
  anonymity_level: 1,
  privacy_level: 0,

  browsing: {
    filter: { urls },
    extra_info_spec: [],
    items: [
      {
        name: "askQuery",
        title: "Search Query",
        description:
          "This item collects all search queries that a user enter in Ask search bar",
        is_enabled: true,
        hook: "webRequest",
        filter: {
          urls: ["*://www.ask.com/*"],
        },
        patterns: [
          {
            method: RequestMethod.GET,
            url_pattern: "https:\\/\\/www\\.ask\\.com\\/(web|youtube)\\?.*",
            pattern_type: MatchType.Regex,
            param: [
              {
                type: "query",
                key: "q",
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
        name: "askSearchResult",
        url_match: "*://www.ask.com/*",
        description:
          "This item collects Ask search results, search category, page number and corresponding search query",
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
            selector: ".PartialSearchResults-item",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".PartialSearchResults-item-title a",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: ".PartialSearchResults-item-title a",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".PartialSearchResults-item-abstract",
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
                selector: ".PartialSearchBox-input",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: ".PartialWebPagination-pgsel",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
              {
                selector: ".PartialChannelNavigation-nav-links .active",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "askClickedLink",
        url_match: "*://www.ask.com/*",
        description:
          "This item collects links clicked by user from Ask search result",
        title: "clicked link",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".PartialSearchResults-item-title",
            event_name: "click",
          },
          {
            selector: ".PartialSearchResults-item-title",
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
                selector: "a",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: "a",
                property: "innerText",
                name: "title",
                type: "text",
              },
            ],
          },
          {
            selector: ".PartialSearchResults-item",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".PartialSearchResults-item-title a",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: ".PartialSearchResults-item-title a",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".PartialSearchResults-item-abstract",
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
                selector: ".PartialSearchBox-input",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: ".PartialWebPagination-pgsel",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
              {
                selector: ".PartialChannelNavigation-nav-links .active",
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
        name: "askSearchResult",
        url_match: "*://www.ask.com/*",
        description:
          "This item collects Ask search results, search category, page number and corresponding search query",
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
            selector: ".PartialSearchResults-item",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".PartialSearchResults-item-title a",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: ".PartialSearchResults-item-title a",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".PartialSearchResults-item-abstract",
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
                selector: ".PartialSearchBox-input",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: ".PartialWebPagination-selected",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "askClickedLink",
        url_match: "*://www.ask.com/*",
        description:
          "This item collects links clicked by user from Ask search result",
        title: "clicked link",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".PartialSearchResults-item-title",
            event_name: "click",
          },
          {
            selector: ".PartialSearchResults-item-title",
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
                selector: "a",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: "a",
                property: "innerText",
                name: "title",
                type: "text",
              },
            ],
          },
          {
            selector: ".PartialSearchResults-item",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: ".PartialSearchResults-item-title a",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: ".PartialSearchResults-item-title a",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".PartialSearchResults-item-abstract",
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
                selector: ".PartialSearchBox-input",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: ".PartialWebPagination-selected",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
            ],
          },
        ],
      },
    ],
  },
};
