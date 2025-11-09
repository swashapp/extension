import { Any } from "@/types/any.type";

export function isEmpty(obj: Any) {
  if (obj == null) return true;

  if (obj.length > 0) return false;
  if (obj.length === 0) return true;

  if (typeof obj !== "object") return true;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

export function deepMerge<T>(target: T, source: Partial<T>): T {
  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      if (!target[key] || typeof target[key] !== "object") {
        (target as Any)[key] = {};
      }
      deepMerge(target[key] as Any, source[key] as Any);
    } else {
      (target as Any)[key] = source[key];
    }
  }
  return target;
}

export function copy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
