import { MatchType } from "@/enums/pattern.enum";
import { FilterStorage } from "@/types/storage/privacy.type";

export const InitialFilters: FilterStorage[] = [
  {
    value: "^(?!http[s]?:).+",
    type: MatchType.Regex,
    immutable: true,
  },
  {
    value:
      "(http|https)://(localhost|([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(\\d{1,3}\\.){3}\\d{1,3}).*",
    type: MatchType.Regex,
    immutable: true,
  },
  {
    value: "https://www.facebook.com/login*",
    type: MatchType.Wildcard,
    immutable: true,
  },
  {
    value: "https://www.facebook.com/v3.2/dialog/oauth*",
    type: MatchType.Wildcard,
    immutable: true,
  },
  {
    value: "https://twitter.com/login*",
    type: MatchType.Wildcard,
    immutable: true,
  },
  {
    value: "https://twitter.com/account*",
    type: MatchType.Wildcard,
    immutable: true,
  },
  {
    value: "https://login.yahoo.com/*",
    type: MatchType.Wildcard,
    immutable: true,
  },
  {
    value: "https://login.live.com/*",
    type: MatchType.Wildcard,
    immutable: true,
  },
  {
    value: "https://login.aol.com/*",
    type: MatchType.Wildcard,
    immutable: true,
  },
  {
    value: "https://accounts.google.com/*",
    type: MatchType.Wildcard,
    immutable: true,
  },
  {
    value: "https://*.dropbox.com/*",
    type: MatchType.Wildcard,
    immutable: true,
  },
  {
    value: "https://drive.google.com/*",
    type: MatchType.Wildcard,
    immutable: true,
  },
  {
    value: "https://docs.google.com/*",
    type: MatchType.Wildcard,
    immutable: true,
  },
  {
    value: "https://www.amazon.com/ap/signin*",
    type: MatchType.Wildcard,
    immutable: true,
  },
];
