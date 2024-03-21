import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["*://*.dailymail.co.uk/*"];

export const DailyMailModule: OnDiskModule = {
  description:
    "This module looks through all activities of a user on dailymail media and captures those activities that the user has permitted",
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
        name: "dailyMailLink",
        description: "This item collects news title and news url after click",
        title: "dailyMail News",
        url_match: "*://*.dailymail.co.uk/*",
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
        name: "dailyMailNewsdetail",
        description:
          "This item collects category, title, author, date and time of news",
        title: "dailyMail News details",
        url_match: "*://*.dailymail.co.uk/*",
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
                selector: "h2",
                property: "innerText",
                name: "Title",
                type: "text",
              },
              {
                selector: ".link-wocc.linkro-wocc.selected",
                property: "innerText",
                name: "category",
                type: "text",
              },
              {
                selector: ".logo-row",
                property: "innerText",
                name: "category",
                type: "text",
              },
              {
                selector: ".author-section.byline-plain",
                property: "innerText",
                name: "Author",
                type: "text",
              },
              {
                selector: ".author",
                property: "innerText",
                name: "Author",
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
