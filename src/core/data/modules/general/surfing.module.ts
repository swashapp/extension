import { PlatformType } from "@/enums/platform.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["*://*/*"];

const excludes = [
  "moz-extension://*/*",
  "*://www.google.com/",
  "*://www.google.com/?*",
  "*://www.google.com/search?*",
  "*://docs.google.com/*",
  "*://drive.google.com/*",
  "*://mail.google.com/*",
  "*://accounts.google.com/*",
  "*://outlook.live.com/*",
  "*://login.live.com/*",
  "*://mail.yahoo.com/*",
  "*://login.yahoo.com/*",
  "*://mail.aol.com/*",
  "*://login.aol.com/*",
  "*://www.icloud.com/mail/*",
  "*://mail.yandex.com/*",
  "*://passport.yandex.com/*",
  "*://www.facebook.com/login*",
  "*://www.facebook.com/v3.2/dialog/oauth*",
  "*://twitter.com/login*",
  "*://twitter.com/account*",
  "*://www.amazon.com/ap/signin*",
  "*://*.amazon.com/oauth?*",
  "*://*.amazon.com/console/*",
  "*://swashapp.io/*",
  "*://*.swashapp.io/*",
];

export const SurfingModule: OnDiskModule = {
  description:
    "This module captures a user navigations for URL patterns that has been permitted by the user",
  is_enabled: true,
  anonymity_level: 0,
  privacy_level: 0,

  ads: {
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
    url_excludes: excludes,
    desktop: [
      {
        name: "displayAd",
        title: "Display advertisement",
        description: "This item add an advertisement to page being visited",
        url_match: "*://*/*",
        type: "sticky",
        is_enabled: true,
        size: {
          width: 240,
          height: 400,
        },
        position: {
          bottom: 0,
          right: 0,
        },
      },
    ],
  },
  browsing: {
    filter: { urls },
    extra_info_spec: [],
    items: [
      {
        name: "New Bookmark",
        title: "Create Bookmark",
        description: "This item collects all bookmarks that created by a user",
        is_enabled: true,
        hook: "bookmarks",
      },
    ],
  },
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
        name: "pageInfo",
        description:
          "This item collects information about the page being visited",
        title: "Page Information",
        url_match: "*://*/*",
        type: "event",
        is_enabled: true,
        events: [
          {
            selector: "document",
            event_name: "DOMContentLoaded",
          },
        ],
        objects: [
          {
            selector: "title",
            properties: [
              {
                property: "innerText",
                name: "title",
                type: "text",
              },
            ],
          },
          {
            selector: "document",
            properties: [
              {
                selector: "meta[name=title]",
                property: "content",
                name: "meta-title",
                type: "text",
              },
              {
                selector: "meta[name=description]",
                property: "content",
                name: "meta-description",
                type: "text",
              },
              {
                property: "URL",
                name: "location",
                type: "url",
              },
              {
                property: "referrer",
                name: "referrer",
                type: "url",
              },
            ],
          },
        ],
      },
    ],
  },
};
