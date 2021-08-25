// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const filterUtils = (function () {
  'use strict';
  function regexFilter(input, regex) {
    if (input.match(regex)) return true;
    return false;
  }

  function matchFilter(input, match) {
    if (input === match) return true;
    return false;
  }

  function wildcardFilter(input, wildcard) {
    const regex = new RegExp(
      '^' + wildcard.split(/\*+/).map(regExpEscape).join('.*') + '$',
    );
    if (input.match(regex)) return true;
    return false;
  }

  function regExpEscape(s) {
    return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
  }

  function filter(input, filters) {
    let ret = false;
    for (const f of filters) {
      switch (f.type) {
        case 'regex':
          ret = regexFilter(input, f.value);
          break;
        case 'wildcard':
          ret = wildcardFilter(input, f.value);
          break;
        case 'exact':
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
