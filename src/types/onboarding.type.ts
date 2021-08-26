import { OnboardingPageValues } from '../enums/onboarding.enum';

import { Any } from './any.type';

export type OnboardingVisibility =
  | 'all'
  | 'none'
  | { core?: { notExistInDB: Any }; ui?: Any };

export type OnboardingPage = {
  version: number;
  visible: OnboardingVisibility;
  next?:
    | OnboardingPageValues
    | { basedOnPage: OnboardingPageValues; default: OnboardingPageValues };
};

export type OnboardingFlow = {
  version: number;
  start: OnboardingPageValues;
  pages: {
    [key in OnboardingPageValues]: OnboardingPage;
  };
};

export type Onboarding = {
  flow: OnboardingFlow;
  completed: boolean;
};
