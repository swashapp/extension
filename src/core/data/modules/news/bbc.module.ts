import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["*://*.bbc.com/*", "*://*.bbc.co.uk/*"];

export const BbcModule: OnDiskModule = {
  description:
    "This module looks through all activities of a user on BBC media and captures those activities that the user has permitted",
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
        name: "bbcLink",
        description: "This item collects news title and news url after click",
        title: "bbc News",
        url_match: "*://*.bbc.com/*",
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
        name: "bbcNewsdetail",
        description:
          "This item collects category, title, author, date and time of news",
        title: "bbc details",
        url_match: "*://*.bbc.com/news/*",
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
                selector: ".byline__name",
                property: "innerText",
                name: "Author",
                type: "text",
              },
              {
                selector: "a.css-6v54e1-StyledLink.eis6szr1",
                property: "innerText",
                name: "category",
                type: "text",
              },
              {
                selector: "time",
                property: "innerText",
                name: "time",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "bbcsportdetail",
        description:
          "This item collects category, title, author, date and time of news",
        title: "bbc sportNews details",
        url_match: "*://*.bbc.com/sport/^(?!.*(live))*",
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
                selector: ".qa-contributor-name.gel-long-primer",
                property: "innerText",
                name: "Author",
                type: "text",
              },
              {
                category: "sport",
                name: "category",
                type: "text",
              },
              {
                selector: "time",
                is_required: true,
                property: "innerText",
                name: "Time",
                type: "text",
              },
            ],
          },
        ],
      },
    ],
  },
};
