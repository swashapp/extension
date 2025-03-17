import { createContext } from "react";

import { OnboardingFlows } from "@/enums/onboarding.enum";

export const OnboardingContext = createContext<{
  flow: OnboardingFlows;
  email: string;
  password: string;
  requestId: string;
  challenge: string;
  referral: string;
  code: string;

  setFlow: (value: OnboardingFlows) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setRequestId: (value: string) => void;
  setChallenge: (value: string) => void;
  setReferral: (value: string) => void;
  setDeviceKey: (value: string) => void;
  setCode: (value: string) => void;
  resetRequestId: () => void;

  next: (step?: number) => void;
  back: (step?: number) => void;
}>({
  flow: OnboardingFlows.LOGIN,
  email: "",
  password: "",
  requestId: "",
  challenge: "",
  referral: "",
  code: "",

  setFlow: () => undefined,
  setEmail: () => undefined,
  setPassword: () => undefined,
  setRequestId: () => undefined,
  setChallenge: () => undefined,
  setReferral: () => undefined,
  setDeviceKey: () => undefined,
  setCode: () => undefined,
  resetRequestId: () => undefined,

  next: () => undefined,
  back: () => undefined,
});
