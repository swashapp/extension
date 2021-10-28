import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Circle } from '../components/drawing/circle';
import { CongratsWalletIsReady } from '../components/onboarding/congrats-wallet-is-ready';
import { CreatingAWallet } from '../components/onboarding/creating-a-wallet';
import { ImportYourConfig } from '../components/onboarding/import-your-config';
import { OnboardingImportant } from '../components/onboarding/onboarding-important';
import { OnboardingJoin } from '../components/onboarding/onboarding-join';
import { OnboardingPrivacy } from '../components/onboarding/onboarding-privacy';
import { OnboardingProfile } from '../components/onboarding/onboarding-profile';
import { OnboardingStart } from '../components/onboarding/onboarding-start';
import Stepper from '../components/stepper/stepper';
import { IStepper } from '../components/stepper/stepper.type';

export const StepperContext = React.createContext<{
  next: () => void;
  back: () => void;
  changeSelectedPage: (page: string, selectedPage: string) => void;
  join: { id?: number; email?: string };
  setJoin: Dispatch<SetStateAction<{ id?: number; email?: string }>>;
}>({
  next: () => undefined,
  back: () => undefined,
  changeSelectedPage: () => undefined,
  join: {},
  setJoin: () => undefined,
});

function OnboardingStep(props: { page: string; flow: string[] }) {
  switch (props.page) {
    case 'Welcome':
      return <OnboardingStart />;
    case 'YourProfileWarning':
      return <></>;
    case 'YourProfile':
      return <OnboardingProfile />;
    case 'New':
      return <></>;
    case 'PrivacyPolicy':
      return <OnboardingPrivacy />;
    case 'OnBoardingResponsibility':
      return <OnboardingImportant />;
    case 'Create':
      return <CreatingAWallet />;
    case 'Join':
      return <OnboardingJoin />;
    case 'Import':
      return <ImportYourConfig />;
    case 'Completed':
      return (
        <CongratsWalletIsReady
          type={props.flow.indexOf('Import') > 0 ? 'imported' : 'created'}
        />
      );
    default:
      return <></>;
  }
}

interface FLOW {
  pages: {
    [key: string]: { next: string; back: string; visible?: 'none' };
  };
  start: string;
}

export function Onboarding(): JSX.Element {
  const ref = useRef<IStepper>();
  const [join, setJoin] = useState({});
  const [flow, setFlow] = useState<FLOW>({
    pages: { Welcome: { next: '', back: '' } },
    start: '',
  });
  const [onSelectedPage, setOnSelectedPage] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    window.helper.getOnboardingFlow().then((res: string) => {
      const newFlow = JSON.parse(res);
      if (typeof newFlow.pages['Import'].next !== 'object') {
        newFlow.pages['Import'].next = {
          basedOnPage: 'Join',
          default: 'Join',
        };
      }
      setFlow(newFlow);
    });
  }, []);

  const getPageAfter = useCallback(
    (page) => {
      let nextPage = '';
      if (flow.start && flow.pages[page]) {
        nextPage = flow.pages[page].next;
        if (typeof nextPage === 'object' && nextPage['basedOnPage']) {
          onSelectedPage[nextPage['basedOnPage']]
            ? (nextPage = onSelectedPage[nextPage['basedOnPage']])
            : (nextPage = nextPage['default']);
        }
      }
      return nextPage;
    },
    [flow.pages, flow.start, onSelectedPage],
  );

  const getNextPageOf = useCallback(
    (page) => {
      let nextPage = getPageAfter(page);
      if (nextPage && flow.pages[nextPage]) {
        while (flow.pages[nextPage].visible === 'none')
          nextPage = getPageAfter(nextPage);
      }
      return nextPage;
    },
    [flow, getPageAfter],
  );

  const changeSelectedPage = useCallback((page, selectedPage) => {
    setOnSelectedPage((_onSelectedPage) => ({
      ..._onSelectedPage,
      [page]: selectedPage,
    }));
  }, []);

  const flattenedFlow: string[] = useMemo(() => {
    const flattened = [];
    if (flow.start) {
      let next = flow.start;
      while (next) {
        flattened.push(next);
        next = getNextPageOf(next);
      }
    }
    return flattened.filter(
      (step) => step !== 'YourProfileWarning' && step !== 'New',
    );
  }, [flow.start, getNextPageOf]);

  return (
    <div className="onboarding-page-container">
      <Circle className={'onboarding-circle1'} border={'black'} />
      <Circle className={'onboarding-circle2'} colorfulGradient />
      <Circle
        className={'onboarding-circle3'}
        border={'black'}
        dashed={'6 14'}
      />
      <Circle className={'onboarding-circle4'} color={'lightest-green'} />
      <Circle
        className={'onboarding-circle5'}
        border={'black'}
        dashed={'6 14'}
      />
      <Circle
        className={'onboarding-circle6'}
        border={'black'}
        dashed={'6 14'}
      />
      <Circle className={'onboarding-circle7'} colorful />
      <div className="onboarding-stepper">
        <StepperContext.Provider
          value={{
            next: () => ref.current?.next(),
            back: () => ref.current?.back(),
            changeSelectedPage,
            join,
            setJoin,
          }}
        >
          <Stepper ref={ref} flow={flattenedFlow}>
            {flattenedFlow.map((page: string, index: number, arr: string[]) => (
              <OnboardingStep key={page + index} page={page} flow={arr} />
            ))}
          </Stepper>
        </StepperContext.Provider>
      </div>
    </div>
  );
}
