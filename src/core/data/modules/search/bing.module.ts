import { RequestMethod } from "@/enums/api.enum";
import { MatchType } from "@/enums/pattern.enum";
import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["*://www.bing.com/*"];

export const BingModule: OnDiskModule = {
  description:
    "This module Captures a user search queries, search results, and links clicked by the user for Bing",
  is_enabled: true,
  anonymity_level: 1,
  privacy_level: 0,

  browsing: {
    filter: { urls },
    extra_info_spec: [],
    items: [
      {
        name: "bingQuery",
        title: "Search Query",
        description:
          "This item collects all search queries that a user enter in Bing search bar",
        is_enabled: true,
        hook: "webRequest",
        filter: {
          urls,
        },
        patterns: [
          {
            method: RequestMethod.GET,
            url_pattern:
              "https:\\/\\/www\\.bing\\.com\\/(([^\\/\\?\\;]*)\\/search)\\?.*",
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
            ],
          },
          {
            method: RequestMethod.GET,
            url_pattern:
              "https:\\/\\/www\\.bing\\.com\\/(shop|maps|search)\\?.*",
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
        name: "bingSearchResult",
        url_match: "*://www.bing.com/*",
        description:
          "This item collects Bing search results, search category, page number and corresponding search query",
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
            selector: "#b_results .b_algo",
            name: "searchResult",
            index_name: "rank",
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
              {
                selector: ".b_caption p",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: "#b_results .b_ad .sb_add",
            name: "adsResult",
            index_name: "rank",
            properties: [
              {
                selector: ".b_caption .b_adurl cite",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: "a",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".b_caption p",
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
                selector: "#sb_form_q",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: ".sb_pagS.sb_pagS_bp.b_widePag.sb_bp",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
              {
                selector: ".b_active a",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "bingClickedLink",
        url_match: "*://www.bing.com/*",
        description:
          "This item collects links clicked by user from Bing search result",
        title: "clicked link",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".b_algo h2",
            event_name: "click",
          },
          {
            selector: ".b_algo h2",
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
            selector: "#b_results .b_algo",
            name: "searchResult",
            index_name: "rank",
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
              {
                selector: ".b_caption p",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: "#b_results .b_ad .sb_add",
            name: "adsResult",
            index_name: "rank",
            properties: [
              {
                selector: ".b_caption .b_adurl cite",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: "a",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".b_caption p",
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
                selector: "#sb_form_q",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: ".sb_pagS.sb_pagS_bp.b_widePag.sb_bp",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
              {
                selector: ".b_active a",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "bingAdsClickedLink",
        url_match: "*://www.bing.com/*",
        description:
          "This item collects Ads links clicked by user from Bing search result",
        title: "Ads clicked link",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".b_ad .sb_add",
            event_name: "click",
          },
          {
            selector: ".b_ad .sb_add",
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
                selector: ".b_caption .b_adurl cite",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: "h2 a",
                property: "innerText",
                name: "title",
                type: "text",
              },
            ],
          },
          {
            selector: "#b_results .b_algo",
            name: "searchResult",
            index_name: "rank",
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
              {
                selector: ".b_caption p",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: "#b_results .b_ad .sb_add",
            name: "adsResult",
            index_name: "rank",
            properties: [
              {
                selector: ".b_caption .b_adurl cite",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: "a",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".b_caption p",
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
                selector: "#sb_form_q",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: ".sb_pagS.sb_pagS_bp.b_widePag.sb_bp",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
              {
                selector: ".b_active a",
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
        name: "bingSearchResult",
        url_match: "*://www.bing.com/*",
        description:
          "This item collects Bing search results, search category, page number and corresponding search query",
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
            selector: "#b_results .b_algo",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: "a",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: "a h2",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".b_caption p",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: "#b_results .b_ad .ad_sc",
            name: "adsResult",
            index_name: "rank",
            properties: [
              {
                selector: ".b_attribution .b_adurl cite",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: "a h2",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".b_caption p",
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
                selector: "#sb_form_q",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: ".b_pag .b_lipgSpan .sb_pagS",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
              {
                selector: ".b_active",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "bingClickedLink",
        url_match: "*://www.bing.com/*",
        description:
          "This item collects links clicked by user from Bing search result",
        title: "clicked link",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".b_algo h2",
            event_name: "click",
          },
          {
            selector: ".b_algo a",
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
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: "h2",
                property: "innerText",
                name: "title",
                type: "text",
              },
            ],
          },
          {
            selector: "#b_results .b_algo",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: "a",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: "a h2",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".b_caption p",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: "#b_results .b_ad .ad_sc",
            name: "adsResult",
            index_name: "rank",
            properties: [
              {
                selector: ".b_attribution .b_adurl cite",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: "a h2",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".b_caption p",
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
                selector: "#sb_form_q",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: ".b_pag .b_lipgSpan .sb_pagS",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
              {
                selector: ".b_active",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "bingAdsClickedLink",
        url_match: "*://www.bing.com/*",
        description:
          "This item collects Ads links clicked by user from Bing search result",
        title: "Ads clicked link",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: ".b_ad .ad_sc",
            event_name: "click",
          },
          {
            selector: ".b_ad .ad_sc",
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
                selector: ".b_attribution .b_adurl cite",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: "a h2",
                property: "innerText",
                name: "title",
                type: "text",
              },
            ],
          },
          {
            selector: "#b_results .b_algo",
            name: "searchResult",
            index_name: "rank",
            properties: [
              {
                selector: "a",
                property: "href",
                name: "link",
                type: "url",
              },
              {
                selector: "a h2",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".b_caption p",
                property: "innerText",
                name: "description",
                type: "text",
              },
            ],
          },
          {
            selector: "#b_results .b_ad .ad_sc",
            name: "adsResult",
            index_name: "rank",
            properties: [
              {
                selector: ".b_attribution .b_adurl cite",
                property: "innerText",
                name: "link",
                type: "text",
              },
              {
                selector: "a h2",
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                selector: ".b_caption p",
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
                selector: "#sb_form_q",
                property: "value",
                name: "query",
                type: "text",
              },
              {
                selector: ".b_pag .b_lipgSpan .sb_pagS",
                property: "innerText",
                name: "pageNumber",
                type: "text",
              },
              {
                selector: ".b_active",
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
