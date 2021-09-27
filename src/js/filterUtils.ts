import { FilterType } from '../enums/filter.enum';
import { Filter } from '../types/storage/filter.type';

const filterUtils = (function () {
  'use strict';
  function regexFilter(input: string, regex: string) {
    return !!input.match(regex);
  }

  function matchFilter(input: string, match: string) {
    return input === match;
  }

  function wildcardFilter(input: string, wildcard: string) {
    const regex = new RegExp(
      '^' + wildcard.split(/\*+/).map(regExpEscape).join('.*') + '$',
    );
    return !!input.match(regex);
  }

  function regExpEscape(str: string) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
  }

  function filter(input: string, filters: Filter[]): boolean {
    let ret = false;
    for (const f of filters) {
      switch (f.type) {
        case FilterType.Regex:
          ret = regexFilter(input, f.value);
          break;
        case FilterType.Wildcard:
          ret = wildcardFilter(input, f.value);
          break;
        case FilterType.Exact:
          ret = matchFilter(input, f.value);
          break;
      }
      if (ret) return ret;
    }
    return ret;
  }

  return {
    filter: filter,
  };
})();
export { filterUtils };
