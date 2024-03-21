import { MatchType } from "@/enums/pattern.enum";

export type FilterStorage = {
  type: MatchType;
  value: string;
  immutable: boolean;
};

export type PrivacyStorage = {
  filters: FilterStorage[];
  masks: string[];
};
