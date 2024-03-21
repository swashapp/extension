import { Any } from "@/types/any.type";

export function jsonUpdate(src: Any, newObject: Any) {
  if (Array.isArray(newObject)) {
    src.length = 0;
    for (const item of newObject) src.push(item);
    return;
  }
  for (const prop in newObject) {
    if (Object.prototype.hasOwnProperty.call(newObject, prop)) {
      const val = newObject[prop];
      if (val != null && typeof val == "object") {
        if (Array.isArray(val)) {
          src[prop] = val;
        } else {
          if (typeof src === "string") {
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

export function arrayRemove(arr: Any, value: Any) {
  return arr.filter((ele: Any) => {
    return ele != value;
  });
}

export function isEmpty(obj: Any) {
  // null and undefined are "empty"
  if (obj == null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== "object") return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

export function serialize(obj: Any) {
  const str = [];
  for (const p in obj)
    if (Object.prototype.hasOwnProperty.call(obj, p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

export async function downloadAsJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });
  if (response.status > 201) throw new Error(`Failed to fetch ${url}`);
  return await response.json();
}
