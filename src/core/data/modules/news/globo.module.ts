import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["*://*.globo.com/*"];

export const GloboModule: OnDiskModule = {
  description:
    "This module looks through all activities of a user on globo media and captures those activities that the user has permitted",
  is_enabled: true,
  anonymity_level: 1,
  privacy_level: 1,

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
        name: "globoLink",
        description: "This item collects news title and news url after click",
        title: "globo News",
        url_match: "*://*.globo.com/*",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "a",
            event_name: "click",
          },
          {
            selector: "a",
            event_name: "contextmenu",
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
                property: "innerText",
                name: "title",
                type: "text",
              },
              {
                property: "href",
                name: "link",
                type: "url",
              },
            ],
          },
        ],
      },
      {
        name: "globoSportDetail",
        description:
          "This item collects category, title, author, date and time of news",
        title: "globo sport details",
        url_match: "*://globoesporte.globo.com/*",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "window",
            event_name: "DOMContentLoaded",
          },
        ],
        objects: [
          {
            selector: "document",
            properties: [
              {
                selector: ".content-head__title",
                property: "innerText",
                name: "Title",
                type: "text",
              },
              {
                selector: ".content-publication-data__updated",
                is_required: true,
                property: "innerText",
                name: "Time",
                type: "text",
              },
              {
                selector: ".content-publication-data__from",
                property: "innerText",
                name: "Author",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "globoSportDetail",
        description:
          "This item collects category, title, author, date and time of news",
        title: "globo news details",
        url_match: "*://revistacrescer.globo.com/*",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "window",
            event_name: "DOMContentLoaded",
          },
        ],
        objects: [
          {
            selector: "document",
            properties: [
              {
                selector: "h1",
                property: "innerText",
                name: "Title",
                type: "text",
              },
              {
                selector: "time",
                is_required: true,
                property: "innerText",
                name: "Time",
                type: "text",
              },
              {
                selector: "#article-author",
                property: "innerText",
                name: "Author",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "globoshowsDetail",
        description:
          "This item collects category, title, author, date and time of news",
        title: "globo shows details",
        url_match: "*://gshow.globo.com/*",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "window",
            event_name: "DOMContentLoaded",
          },
        ],
        objects: [
          {
            selector: "document",
            properties: [
              {
                selector: ".content-head__title",
                property: "innerText",
                name: "Title",
                type: "text",
              },
              {
                selector: ".content-publication-data__updated",
                is_required: true,
                property: "innerText",
                name: "Time",
                type: "text",
              },
              {
                selector: ".content-publication-data__from",
                property: "innerText",
                name: "Author",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "globoNewsDetail",
        description:
          "This item collects category, title, author, date and time of news",
        title: "globo news details",
        url_match: "*://revistaglamour.globo.com/*",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "window",
            event_name: "DOMContentLoaded",
          },
        ],
        objects: [
          {
            selector: "document",
            properties: [
              {
                selector: "h1",
                property: "innerText",
                name: "Title",
                type: "text",
              },
              {
                selector: "time:nth-child(1)",
                is_required: true,
                property: "innerText",
                name: "Time",
                type: "text",
              },
              {
                selector: ".article-author",
                property: "innerText",
                name: "Author",
                type: "text",
              },
              {
                selector: ".authorship",
                property: "innerText",
                name: "Author",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "globovogueNewsDetail",
        description:
          "This item collects category, title, author, date and time of news",
        title: "globo voguenews details",
        url_match: "*://vogue.globo.com/*",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "window",
            event_name: "DOMContentLoaded",
          },
        ],
        objects: [
          {
            selector: "document",
            properties: [
              {
                selector: "h1",
                property: "innerText",
                name: "Title",
                type: "text",
              },
              {
                selector: ".last-modified",
                is_required: true,
                property: "innerText",
                name: "Time",
                type: "text",
              },
              {
                selector: "#article-author",
                property: "innerText",
                name: "Author",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "globovogueNewsDetail",
        description:
          "This item collects category, title, author, date and time of news",
        title: "globo voguenews details",
        url_match: "*://revistaquem.globo.com/*",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "window",
            event_name: "DOMContentLoaded",
          },
        ],
        objects: [
          {
            selector: "document",
            properties: [
              {
                selector: "h1",
                property: "innerText",
                name: "Title",
                type: "text",
              },
              {
                selector: "time",
                is_required: true,
                property: "innerText",
                name: "Time",
                type: "text",
              },
              {
                selector: "#article-author",
                property: "innerText",
                name: "Author",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "globoGlobalNewsdetail",
        description:
          "This item collects category, title, author, date and time of news",
        title: "globo details",
        url_match: "*://oglobo.globo.com/*",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "window",
            event_name: "DOMContentLoaded",
          },
        ],
        objects: [
          {
            selector: "document",
            properties: [
              {
                selector: ".article__title",
                property: "innerText",
                name: "Title",
                type: "text",
              },
              {
                selector: ".article__date",
                is_required: true,
                property: "innerText",
                name: "Time",
                type: "text",
              },
              {
                selector: ".article__author",
                property: "innerText",
                name: "Author",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "globoNewsdetail",
        description:
          "This item collects category, title, author, date and time of news",
        title: "globo details",
        url_match: "*://gq.globo.com/*",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "window",
            event_name: "DOMContentLoaded",
          },
        ],
        objects: [
          {
            selector: "document",
            properties: [
              {
                selector: "h1",
                property: "innerText",
                name: "Title",
                type: "text",
              },
              {
                selector: "time",
                is_required: true,
                property: "innerText",
                name: "Time",
                type: "text",
              },
              {
                selector: "#article-author",
                property: "innerText",
                name: "Author",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "globoNewsdetail",
        description:
          "This item collects category, title, author, date and time of news",
        title: "globo news details",
        url_match: "*://g1.globo.com/*",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "window",
            event_name: "DOMContentLoaded",
          },
        ],
        objects: [
          {
            selector: "document",
            properties: [
              {
                selector: ".content-head__title",
                property: "innerText",
                name: "Title",
                type: "text",
              },
              {
                selector: ".content-publication-data__updated",
                is_required: true,
                property: "innerText",
                name: "Time",
                type: "text",
              },
              {
                selector: ".content-publication-data__from",
                property: "innerText",
                name: "Author",
                type: "text",
              },
            ],
          },
        ],
      },
    ],
  },
};
