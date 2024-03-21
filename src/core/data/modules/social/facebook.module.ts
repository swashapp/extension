import { RequestMethod } from "@/enums/api.enum";
import { MatchType } from "@/enums/pattern.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["https://www.facebook.com/*"];

export const FacebookModule: OnDiskModule = {
  description:
    "This module looks through all activities of a user on Facebook and captures those activities that the user has permitted",
  is_enabled: true,
  anonymity_level: 2,
  privacy_level: 1,

  browsing: {
    filter: { urls },
    extra_info_spec: [],
    items: [
      {
        name: "Search",
        title: "Facebook Search",
        description:
          "This item collects all search queries that a user has entered on Facebook search bar",
        is_enabled: true,
        hook: "webRequest",
        patterns: [
          {
            method: RequestMethod.GET,
            url_pattern:
              "^https:\\/\\/www\\.facebook\\.com\\/search\\/top\\/.*",
            pattern_type: MatchType.Regex,
            param: [
              {
                type: "query",
                key: "q",
                name: "query",
              },
            ],
            schems: [
              {
                jpath: "$.query",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "Page Visit",
        title: "Links clicked by user",
        description:
          "This item collects all pages in Facebook that a user has visited",
        is_enabled: true,
        hook: "webRequest",
        target_listener: "inspectVisit",
      },
      {
        name: "Visiting Graph",
        title: "Visiting Graph",
        description:
          "This item collects all navigations that a user does in Facebook web pages",
        is_enabled: true,
        hook: "webRequest",
        target_listener: "inspectReferrer",
      },
    ],
  },
};
