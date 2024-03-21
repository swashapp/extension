import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["*://*.cnn.com*"];

export const CnnModule: OnDiskModule = {
  description:
    "This module looks through all activities of a user on cnn media and captures those activities that the user has permitted",
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
        name: "CNNLink",
        description: "This item collects news title and news url after click",
        title: "CNN News",
        url_match: "*://*.cnn.com*",
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
                property: "href",
                name: "link",
                type: "url",
              },
              {
                property: "innerText",
                name: "title",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "cnnnewsdetail",
        description:
          "This item collects category, title, author, date and time of news",
        title: "cnn News details",
        url_match: "*://*.cnn.com/*",
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
                selector: "#header-nav-container a[data-test=section-link]",
                property: "attributes['aria-label'].value",
                name: "category",
                type: "text",
              },
              {
                selector: ".metadata__byline",
                property: "innerText",
                name: "Author",
                type: "text",
              },
              {
                selector: ".update-time",
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
