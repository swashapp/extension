import { MatchType } from "@/enums/pattern.enum";
import { FilterStorage } from "@/types/storage/privacy.type";

import { regex, wildcard } from "./pattern.util";

export function match(input: string, filters: FilterStorage[]): boolean {
  let ret = false;
  for (const f of filters) {
    switch (f.type) {
      case MatchType.Regex:
        ret = regex(input, f.value);
        break;
      case MatchType.Wildcard:
        ret = wildcard(input, f.value);
        break;
      case MatchType.Exact:
        ret = input === f.value;
        break;
    }
    if (ret) return ret;
  }
  return ret;
}
