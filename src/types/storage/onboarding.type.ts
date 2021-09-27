import { Any } from '../any.type';

export type OnboardingPage = {
  version: number;
  visible: string | { core?: { notExistInDB: Any }; ui?: Any };
  next?: string | { basedOnPage: string; default: string };
};

export type OnboardingFlow = {
  version: number;
  start: string;
  pages: {
    [key in string]: OnboardingPage;
  };
};

export type Onboarding = {
  flow?: OnboardingFlow;
  completed?: boolean;
};
