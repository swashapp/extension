import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["*://*.yahoo.com/*"];

export const YahooModule: OnDiskModule = {
  description:
    "This module looks through all activities of a user on yahoo media and captures those activities that the user has permitted",
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
        name: "yahooLink",
        description: "This item collects news title and news url after click",
        title: "Yahoo",
        url_match: "*://*.yahoo.com/*",
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
        name: "yahooDetails",
        description:
          "This item collects category, title, author, date and time of news",
        title: "Yahoo",
        url_match: "*://*.yahoo.com/*",
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
                selector: "h1:first-child",
                property: "innerText",
                name: "Title",
                type: "text",
              },
              {
                selector: ".caas-attr-meta",
                property: "innerText",
                name: "Author",
                type: "text",
              },
              {
                selector: "time:first-child",
                property: "innerText",
                name: "date",
                type: "text",
              },
              {
                selector: ".caas-category-label:first-child",
                property: "innerText",
                name: "category",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "yahooDetail",
        description:
          "This item collects category, title, author, date and time of news",
        title: "Yahoo News",
        url_match: "*://*yahoo.com/news/*",
        type: "event",
        ready_at: "DOMChange",
        observing_target_node: "#homepage-viewer",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        is_enabled: true,
        events: [
          {
            selector: "#homepage-viewer",
            event_name: "mouseenter",
          },
        ],
        objects: [
          {
            selector: "article",
            properties: [
              {
                selector: "h1",
                property: "innerText",
                name: "Title",
                type: "text",
              },
              {
                selector: ".caas-attr-meta",
                property: "innerText",
                name: "Author",
                type: "text",
              },
              {
                selector: ".caas-attr-time-style",
                property: "innerText",
                name: "time",
                type: "text",
              },
            ],
          },
        ],
      },
    ],
  },
};
