import { RequestMethod } from "@/enums/api.enum";
import { MatchType } from "@/enums/pattern.enum";
import { OnDiskModule } from "@/types/handler/module.type";

const urls = ["https://*.twitter.com/*"];

export const TwitterModule: OnDiskModule = {
  description:
    "This module looks through all activities of a user on twitter and captures those activities that the user has permitted",
  is_enabled: true,
  anonymity_level: 1,
  privacy_level: 1,

  browsing: {
    filter: { urls },
    extra_info_spec: [],
    items: [
      {
        name: "Post Tweet",
        title: "Post a new tweet",
        description:
          "This item collects all tweets that a user has posted in Twitter",
        is_enabled: true,
        hook: "webRequest",
        extra_info_spec: ["requestBody"],
        patterns: [
          {
            method: RequestMethod.POST,
            url_pattern: "https://api.twitter.com/1.1/statuses/update.json",
            pattern_type: MatchType.Exact,
            param: [
              {
                type: "form",
                key: "status",
                name: "text",
              },
            ],
            schems: [
              {
                jpath: "$.text",
                type: "text",
              },
            ],
          },
        ],
      },
      {
        name: "Search",
        title: "Twitter Search",
        description:
          "This item collects all search queries that a user has entered in Twitter search bar",
        is_enabled: true,
        hook: "webRequest",
        patterns: [
          {
            method: RequestMethod.GET,
            url_pattern:
              "https:\\/\\/twitter\\.com\\/hashtag\\/([^?]+)\\?src=hash",
            pattern_type: MatchType.Regex,
            param: [
              {
                type: "regex",
                group: 1,
                name: "hashtag",
              },
            ],
            schems: [
              {
                jpath: "$.hashtag",
                type: "text",
              },
            ],
          },
          {
            method: RequestMethod.GET,
            url_pattern:
              "https:\\/\\/twitter\\.com\\/search\\?q=([^&]+)&src=typd",
            pattern_type: MatchType.Regex,
            param: [
              {
                type: "regex",
                group: 1,
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
          {
            method: RequestMethod.GET,
            url_pattern:
              "https:\\/\\/api\\.twitter\\.com\\/1\\.1\\/search\\/typeahead\\.json\\?q=([^&]+)&.*",
            pattern_type: MatchType.Regex,
            param: [
              {
                type: "regex",
                group: 1,
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
      {
        name: "Follow",
        title: "Follow action",
        description: "This item collects all user's follow actions in Twitter",
        is_enabled: true,
        hook: "webRequest",
        extra_info_spec: ["requestBody"],
        patterns: [
          {
            method: RequestMethod.POST,
            url_pattern: "https://api.twitter.com/1.1/friendships/create.json",
            pattern_type: MatchType.Exact,
            param: [
              {
                type: "form",
                key: "id",
                name: "user_id",
              },
            ],
            schems: [
              {
                jpath: "$.user_id",
                type: "userInfo",
              },
            ],
          },
        ],
      },
      {
        name: "Unfollow",
        title: "Unfollow action",
        description:
          "This item collects all user's unfollow actions in Twitter",
        is_enabled: true,
        hook: "webRequest",
        extra_info_spec: ["requestBody"],
        patterns: [
          {
            method: RequestMethod.POST,
            url_pattern: "https://api.twitter.com/1.1/friendships/destroy.json",
            pattern_type: MatchType.Exact,
            param: [
              {
                type: "form",
                key: "id",
                name: "user_id",
              },
            ],
            schems: [
              {
                jpath: "$.user_id",
                type: "userInfo",
              },
            ],
          },
        ],
      },
      {
        name: "Mute",
        title: "Mute action",
        description: "This item collects all user's mute actions in Twitter",
        is_enabled: true,
        hook: "webRequest",
        extra_info_spec: ["requestBody"],
        patterns: [
          {
            method: RequestMethod.POST,
            url_pattern: "https://api.twitter.com/1.1/mutes/users/create.json",
            pattern_type: MatchType.Exact,
            param: [
              {
                type: "form",
                key: "id",
                name: "user_id",
              },
            ],
            schems: [
              {
                jpath: "$.user_id",
                type: "userInfo",
              },
            ],
          },
        ],
      },
      {
        name: "Unmute",
        title: "Unmute action",
        description: "This item collects all user's unmute actions in Twitter",
        is_enabled: true,
        hook: "webRequest",
        extra_info_spec: ["requestBody"],
        patterns: [
          {
            method: RequestMethod.POST,
            url_pattern: "https://api.twitter.com/1.1/mutes/users/destroy.json",
            pattern_type: MatchType.Exact,
            param: [
              {
                type: "form",
                key: "id",
                name: "user_id",
              },
            ],
            schems: [
              {
                jpath: "$.user_id",
                type: "userInfo",
              },
            ],
          },
        ],
      },
      {
        name: "Like",
        title: "Like action",
        description: "This item collects all user's like actions in Twitter",
        is_enabled: true,
        hook: "webRequest",
        extra_info_spec: ["requestBody"],
        patterns: [
          {
            method: RequestMethod.POST,
            url_pattern: "https://api.twitter.com/1.1/favorites/create.json",
            pattern_type: MatchType.Exact,
            param: [
              {
                type: "form",
                key: "id",
                name: "tweet_id",
              },
            ],
            schems: [
              {
                jpath: "$.tweet_id",
                type: "id",
              },
            ],
          },
        ],
      },
      {
        name: "Retweet",
        title: "Retweet",
        description: "This item collects all user's retweet actions in Twitter",
        is_enabled: true,
        hook: "webRequest",
        extra_info_spec: ["requestBody"],
        patterns: [
          {
            method: RequestMethod.POST,
            url_pattern: "https://api.twitter.com/1.1/statuses/retweet.json",
            pattern_type: MatchType.Exact,
            param: [
              {
                type: "form",
                key: "id",
                name: "tweet_id",
              },
            ],
            schems: [
              {
                jpath: "$.tweet_id",
                type: "id",
              },
            ],
          },
        ],
      },
      {
        name: "Visit",
        title: "Visit User page",
        description:
          "This item collects all users pages that this user has visited in Twitter",
        is_enabled: true,
        hook: "webRequest",
        patterns: [
          {
            method: RequestMethod.GET,
            url_pattern: "https:\\/\\/twitter\\.com\\/([_A-Za-z0-9]+)(\\?.*)?$",
            pattern_type: MatchType.Regex,
            param: [
              {
                type: "regex",
                group: 1,
                name: "username",
              },
            ],
            schems: [
              {
                jpath: "$.username",
                type: "userInfo",
              },
            ],
          },
        ],
      },
      {
        name: "Page Visit",
        title: "visited pages",
        description:
          "This item collects all pages that user has visited in Twitter",
        is_enabled: true,
        hook: "webRequest",
        target_listener: "inspectVisit",
      },
      {
        name: "Visiting Graph",
        title: "Visiting Graph",
        description:
          "This item collects all navigations that user has done in Twitter web pages",
        is_enabled: true,
        hook: "webRequest",
        target_listener: "inspectReferrer",
      },
    ],
  },
};
