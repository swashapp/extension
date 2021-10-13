import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import Circle from '../components/drawing/circle';
import CongratsWalletIsReady from '../components/onboarding/congrats-wallet-is-ready';
import CreatingAWallet from '../components/onboarding/creating-a-wallet';
import EmailSent from '../components/onboarding/email-sent';
import ImportYourConfig from '../components/onboarding/import-your-config';
import OnBoardingImportant from '../components/onboarding/onboarding-important';
import OnBoardingJoin from '../components/onboarding/onboarding-join';
import OnBoardingPrivacy from '../components/onboarding/onboarding-privacy';
import OnBoardingProfile from '../components/onboarding/onboarding-profile';
import OnBoardingStart from '../components/onboarding/onboarding-start';
import OnBoardingVerify from '../components/onboarding/onboarding-verify';
import Stepper from '../components/stepper/stepper';
import { IStepper } from '../components/stepper/stepper.type';

export const StepperContext = React.createContext<{
  next: () => void;
  back: () => void;
  changeSelectedPage: (page: string, selectedPage: string) => void;
}>({
  next: () => undefined,
  back: () => undefined,
  changeSelectedPage: () => undefined,
});

function OnboardingStep(props: { page: string }) {
  switch (props.page) {
    case 'Welcome':
      return <OnBoardingStart />;
    case 'YourProfileWarning':
      return <></>;
    case 'YourProfile':
      return <OnBoardingProfile />;
    case 'New':
      return <></>;
    case 'PrivacyPolicy':
      return <OnBoardingPrivacy />;
    case 'OnBoardingResponsibility':
      return <OnBoardingImportant />;
    case 'Create':
      return <CreatingAWallet />;
    case 'Join':
      return <OnBoardingJoin />;
    case 'Import':
      return <ImportYourConfig />;
    case 'Completed':
      // window.helper.submitOnBoarding().then(() => {
      //   this.setState({ shouldRedirect: true, CurrentPage: 'Home' });
      // });
      return <div />;
    // Redirect to Settings
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

export default memo(function OnBoarding() {
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
    return flattened;
  }, [flow.start, getNextPageOf]);
  const ref = useRef<IStepper>();
  return (
    <div className="page-container">
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
          }}
        >
          <Stepper ref={ref} flow={flattenedFlow}>
            {flattenedFlow
              .filter((step) => step !== 'YourProfileWarning' && step !== 'New')
              .map((page: string, index: number) => (
                <OnboardingStep key={page + index} page={page} />
              ))}
          </Stepper>
        </StepperContext.Provider>
      </div>
    </div>
  );
});
