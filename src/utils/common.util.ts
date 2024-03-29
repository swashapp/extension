import hash from 'fast-sha256';

const commonUtils = (function () {
  function jsonUpdate(src, newObj) {
    if (Array.isArray(newObj)) {
      src.length = 0;
      for (const item of newObj) src.push(item);
      return;
    }
    for (const prop in newObj) {
      if (newObj.hasOwnProperty(prop)) {
        const val = newObj[prop];
        if (val != null && typeof val == 'object') {
          // this also applies to arrays or null!
          if (Array.isArray(val)) {
            src[prop] = val;
          } else {
            if (typeof src === 'string') {
              src = val;
              return;
            }
            if (!src[prop]) src[prop] = {};
            jsonUpdate(src[prop], val);
          }
        } else src[prop] = val;
      }
    }
  }

  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }

  function isEmpty(obj) {
    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    // If it isn't an object at this point
    // it is empty, but it can't be anything *but* empty
    // Is it empty?  Depends on your application.
    if (typeof obj !== 'object') return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (const key in obj) {
      if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
  }

  function sha256(msg: string) {
    const utf8 = new TextEncoder().encode(msg);
    const hashBuffer = hash(utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join('');
  }

  function uuid() {
    function randomDigit() {
      if (crypto && crypto.getRandomValues) {
        const rands = new Uint8Array(1);
        crypto.getRandomValues(rands);
        return (rands[0] % 16).toString(16);
      } else {
        return ((Math.random() * 16) | 0).toString(16);
      }
    }
    const crypto = self.crypto || self.msCrypto;
    return 'xxxxxxxx-xxxx-4xxx-8xxx-xxxxxxxxxxxx'.replace(/x/g, randomDigit);
  }

  function wildcard(input, wc) {
    function regExpEscape(s) {
      return s.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
    }
    const regex = new RegExp(
      '^' + wc.split(/\*+/).map(regExpEscape).join('.*') + '$',
    );
    if (!input.match(regex)) return null;
    return input;
  }

  function serialize(obj) {
    const str = [];
    for (const p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    return str.join('&');
  }

  async function dlJson<Type>(url: string): Promise<Type> {
    const response = await fetch(url, { cache: 'no-store' });
    if (response.status > 201) throw new Error(`Failed to fetch ${url}`);
    return await response.json();
  }

  function isToday(someDate: Date): boolean {
    const today = new Date();
    return (
      someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
    );
  }

  return {
    jsonUpdate,
    wildcard,
    sha256,
    uuid,
    serialize,
    isEmpty,
    arrayRemove,
    dlJson,
    isToday,
  };
})();

export { commonUtils };
