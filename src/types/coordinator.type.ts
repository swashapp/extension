import { AccountStages } from "@/enums/account.enum";

export type AppStates = {
  stage: AccountStages;
  isActive: boolean;
  isOutOfDate: boolean;
};

export type CoordinatorCallback<T> = (value: T, oldValue: T) => void;
