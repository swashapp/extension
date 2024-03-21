import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["*://*.uol.com.br/*"];

export const UolModule: OnDiskModule = {
  description:
    "This module looks through all activities of a user on uol media and captures those activities that the user has permitted",
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
        name: "uolLink",
        description: "This item collects news title and news url after click",
        title: "uol News",
        url_match: "*://*.uol.com.br/*",
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
        name: "uolnewsdetail",
        description:
          "This item collects category, title, author, date and time of news",
        title: "uol News details",
        url_match: "*://*.uol.com.br/esporte/*",
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
                selector: ".title-name",
                property: "innerText",
                name: "category",
                type: "text",
              },
              {
                selector: ".p-author.time",
                is_required: true,
                property: "innerText",
                name: "Time",
                type: "text",
              },
              {
                selector: "p.p-author:not(.time)",
                property: "innerText",
                name: "Author",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "uolnewsdetail",
        description:
          "This item collects category, title, author, date and time of news",
        title: "uol News details",
        url_match: "*://noticias.uol.com.br/*",
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
                selector: ".title-name",
                property: "innerText",
                name: "category",
                type: "text",
              },
              {
                selector: ".p-author.time",
                is_required: true,
                property: "innerText",
                name: "Time",
                type: "text",
              },
              {
                selector: "p.p-author:not(.time)",
                property: "innerText",
                name: "Author",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "uolnewsdetail",
        description:
          "This item collects category, title, author, date and time of news",
        title: "uol News details",
        url_match: "*://*.uol.com.br/noticias/*",
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
                selector: ".title-name",
                property: "innerText",
                name: "category",
                type: "text",
              },
              {
                selector: ".p-author.time",
                is_required: true,
                property: "innerText",
                name: "Time",
                type: "text",
              },
              {
                selector: "p.p-author:not(.time)",
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
