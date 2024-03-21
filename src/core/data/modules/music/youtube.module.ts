import { RequestMethod } from "@/enums/api.enum";
import { MatchType } from "@/enums/pattern.enum";
import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["*://*.youtube.com/*"];

export const YoutubeModule: OnDiskModule = {
  description:
    "This module looks through all activities of a user on Youtube and captures those activities that the user has permitted",
  is_enabled: true,
  anonymity_level: 1,
  privacy_level: 1,

  browsing: {
    filter: {
      urls: urls,
    },
    extra_info_spec: [],
    items: [
      {
        name: "Page Action",
        title: "Page actions",
        description:
          "This item collects all actions a user does in Youtube pages",
        is_enabled: true,
        hook: "webRequest",
        extra_info_spec: ["requestBody"],
        patterns: [
          {
            method: RequestMethod.POST,
            url_pattern: "^https:\\/\\/www\\.youtube\\.com\\/service_ajax.*",
            pattern_type: MatchType.Regex,
            param: [
              {
                type: "query",
                key: "name",
                name: "action",
              },
              {
                type: "form",
                key: "sej",
                name: "detail",
              },
            ],
            schems: [
              {
                jpath: "$.action",
                type: "text",
              },
              {
                jpath: "$.detail",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "Search",
        title: "Youtube Search",
        description:
          "This item collect all search queries that a user enters in Youtube search bar",
        is_enabled: true,
        hook: "webRequest",
        patterns: [
          {
            method: RequestMethod.GET,
            url_pattern: "^https:\\/\\/www\\.youtube\\.com\\/results.*",
            pattern_type: MatchType.Regex,
            param: [
              {
                type: "query",
                key: "search_query",
                name: "q",
              },
            ],
            schems: [
              {
                jpath: "$.q",
                type: "text",
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
        name: "Video Time Duration",
        description:
          "This item collects the duration of a video watched by a user",
        url_match: "*://*.youtube.com/*",
        title: "video time duration",
        type: "event",
        ready_at: "windowChange",
        observing_target_node: "#primary .title",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        is_enabled: true,
        events: [
          {
            selector: "window",
            event_name: "beforeunload",
          },
          {
            selector: "a",
            event_name: "click",
          },
        ],
        objects: [
          {
            is_required: true,
            selector: "#primary .ytp-time-duration",
            properties: [
              {
                property: "innerHTML",
                name: "duration",
                type: "text",
              },
            ],
          },
          {
            is_required: true,
            selector: "#primary .ytp-time-current",
            properties: [
              {
                property: "innerHTML",
                name: "current",
                type: "text",
              },
            ],
          },
          {
            selector: "#primary .title",
            properties: [
              {
                property: "innerText",
                name: "title",
                type: "text",
              },
            ],
          },
        ],
      },
    ],
    mobile: [
      {
        name: "Video Time Duration",
        description:
          "This item collects the duration of a video watched by a user",
        url_match: "*://*.youtube.com/*",
        title: "video time duration",
        type: "event",
        ready_at: "windowChange",
        observing_target_node: "#primary .title",
        observing_config: {
          attributes: false,
          childList: true,
          subtree: true,
        },
        is_enabled: true,
        events: [
          {
            selector: "window",
            event_name: "beforeunload",
          },
          {
            selector: "a",
            event_name: "click",
          },
        ],
        objects: [
          {
            is_required: true,
            selector: ".time-second",
            properties: [
              {
                property: "innerHTML",
                name: "duration",
                type: "text",
              },
            ],
          },
          {
            is_required: true,
            selector: ".time-first",
            properties: [
              {
                property: "innerHTML",
                name: "current",
                type: "text",
              },
            ],
          },
          {
            selector: ".slim-video-metadata-title",
            properties: [
              {
                property: "innerText",
                name: "title",
                type: "text",
              },
            ],
          },
        ],
      },
    ],
  },
};
