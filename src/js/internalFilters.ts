import { FilterType } from '../enums/filter.enum';
import { Filter } from '../types/storage/filter.type';

const internalFilters = [
  {
    value: 'https://*.dropbox.com/*',
    type: FilterType.Wildcard,
    internal: true,
  },
  {
    value: 'https://www.amazon.com/ap/signin*',
    type: FilterType.Wildcard,
    internal: true,
  },
  {
    value: 'https://www.facebook.com/login*',
    type: FilterType.Wildcard,
    internal: true,
  },
  {
    value: 'https://www.facebook.com/v3.2/dialog/oauth*',
    type: FilterType.Wildcard,
    internal: true,
  },
  {
    value: 'https://login.yahoo.com/*',
    type: FilterType.Wildcard,
    internal: true,
  },
  {
    value: 'https://accounts.google.com/*',
    type: FilterType.Wildcard,
    internal: true,
  },
  {
    value: 'https://login.live.com/*',
    type: FilterType.Wildcard,
    internal: true,
  },
  {
    value: 'https://login.aol.com/*',
    type: FilterType.Wildcard,
    internal: true,
  },
  {
    value: 'https://twitter.com/login*',
    type: FilterType.Wildcard,
    internal: true,
  },
  {
    value: 'https://twitter.com/account*',
    type: FilterType.Wildcard,
    internal: true,
  },
  {
    value: 'https://drive.google.com/*',
    type: FilterType.Wildcard,
    internal: true,
  },
  {
    value: 'https://docs.google.com/*',
    type: FilterType.Wildcard,
    internal: true,
  },
  {
    value: '^(?!http[s]?:).+',
    type: FilterType.Regex,
    internal: true,
  },
  {
    value:
      '(http|https)://(localhost|([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(\\d{1,3}\\.){3}\\d{1,3}).*',
    type: FilterType.Regex,
    internal: true,
  },
] as Filter[];

export { internalFilters };
