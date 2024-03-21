import { AppStages } from "@/enums/app.enum";

export type AppStates = {
  stage: AppStages;
  isActive: boolean;
  isOutOfDate: boolean;
};

export type CoordinatorCallback<T> = (value: T, oldValue: T) => void;
