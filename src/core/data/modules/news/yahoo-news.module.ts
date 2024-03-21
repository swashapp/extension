import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["*://news.yahoo.com/*", "*://*.yahoo.co.jp/*"];

export const YahooNewsModule: OnDiskModule = {
  description:
    "This module looks through all activities of a user on yahooNews media and captures those activities that the user has permitted",
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
        name: "yahooNewsDetails",
        description:
          "This item collects category, title, author, date and time of news",
        title: "Yahoo News",
        url_match: "*://*yahoo.com/*",
        type: "event",
        ready_at: "DOMChange",
        observing_target_node: "article",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        is_enabled: true,
        events: [
          {
            selector: "article",
            event_name: "mouseenter",
          },
        ],
        objects: [
          {
            selector: "",
            properties: [
              {
                selector: "h1",
                property: "innerText",
                name: "Title",
                type: "text",
              },
              {
                selector: ".author.Mb\\(4px\\).D\\(ib\\)",
                property: "innerText",
                name: "Author",
                type: "text",
              },
              {
                selector: "time",
                property: "innerText",
                name: "date",
                type: "text",
              },
            ],
          },
        ],
      },
    ],
  },
};
