import React, {
  forwardRef,
  PropsWithChildren,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
} from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS, Step } from 'react-joyride';

import { RouteToPages } from '../../paths';

import { TourNavigationButtons } from './tour-navigation-buttons';

const tourStyles = {
  spotlight: {
    borderRadius: '20px',
    padding: 0,
    backgroundColor: 'transparent',
    boxShadow: '0 0 0 99999px rgba(0, 32, 48, 0.7)',
  },
  spotlightLegacy: {},
  buttonClose: {
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='10' height='10' viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath" +
      " d='M9.94981 1.4638L8.5358 0.0498047L4.9998 3.5858L1.4638 0.0498047L0.0498047 1.4638L3.5858 4.9998L0.0498047 8.5358L1.4638 9.94981L4.9998 6.4138L8.5358 9.94981L9.94981 8.5358L6.4138 4.9998L9.94981 1.4638Z'" +
      " fill='black'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  tooltip: {
    background: 'var(--white)',
    boxShadow:
      '0px 10px 20px rgba(44, 62, 62, 0.04), 0 2px 6px rgba(44, 62, 62, 0.04), 0 0 1px rgba(44, 62, 62, 0.04)',
    borderRadius: 12,
    padding: 0,
    margin: 0,
  },
  overlay: {
    backgroundColor: 'transparent',
  },
  options: {
    zIndex: 10000,
  },
};

export enum TOUR_NAME {
  WALLET = 'wallet',
  INVITE_FRIENDS = 'friends',
  SETTINGS = 'settings',
  DATA = 'data',
  HELP = 'help',
}

export const TourContext = React.createContext<{
  next: () => void;
  back: () => void;
  stop: () => void;
}>({
  next: () => undefined,
  back: () => undefined,
  stop: () => undefined,
});

export default forwardRef(function Tour(
  props: PropsWithChildren<{
    steps: (Step & { header: string })[];
    tourName: TOUR_NAME;
    onStart?: () => void;
  }>,
  ref,
) {
  const INITIAL_STATE = useMemo(
    () => ({
      key: new Date(),
      run: false,
      continuous: false,
      loading: false,
      stepIndex: 0,
      steps: props.steps,
    }),
    [props.steps],
  );

  const reducer = useCallback(
    (state = INITIAL_STATE, action) => {
      switch (action.type) {
        // start the tour
        case 'START':
          return { ...state, run: true };
        // Reset to 0th step
        case 'RESET':
          return { ...state, stepIndex: 0 };
        // Stop the tour
        case 'STOP':
          window.location.hash = RouteToPages.help;
          return { ...state, run: false };
        // Update the steps for next / back button click
        case 'NEXT_OR_PREV':
          return { ...state, ...action.payload };
        case 'NEXT':
          return { ...state, stepIndex: state.stepIndex + 1 };
        case 'PREV':
          return { ...state, stepIndex: state.stepIndex - 1 };
        // Restart the tour - reset go to 1st step, restart create new tour
        case 'RESTART':
          return {
            ...state,
            stepIndex: 0,
            run: true,
            loading: false,
            key: new Date(),
          };
        default:
          return state;
      }
    },
    [INITIAL_STATE],
  );
  const [tourState, dispatch] = useReducer(reducer, INITIAL_STATE);
  const callback = useCallback(
    (data) => {
      const { action, index, type, status } = data;

      if (
        // If close button clicked then close the tour
        action === ACTIONS.CLOSE ||
        // If skipped or end tour, then close the tour
        (status === STATUS.SKIPPED && tourState.run) ||
        status === STATUS.FINISHED
      ) {
        dispatch({ type: 'STOP' });
      } else if (
        type === EVENTS.STEP_AFTER ||
        type === EVENTS.TARGET_NOT_FOUND
      ) {
        // Check whether next or back button click and update the step
        dispatch({
          type: 'NEXT_OR_PREV',
          payload: { stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) },
        });
      }
    },
    [tourState.run],
  );

  const start = useCallback(() => dispatch({ type: 'START' }), [dispatch]);
  const next = useCallback(() => dispatch({ type: 'NEXT' }), [dispatch]);
  const back = useCallback(() => dispatch({ type: 'PREV' }), [dispatch]);
  const stop = useCallback(() => dispatch({ type: 'STOP' }), [dispatch]);

  useEffect(() => {
    const search = window.location.hash.split('?');
    if (search) {
      const _tour = new URLSearchParams(search[1]).get('tour');

      if (_tour && _tour === props.tourName) {
        start();
      }
    }
  }, [props.tourName, start]);

  useImperativeHandle(ref, () => ({
    start,
    next,
    back,
    stop,
  }));
  useEffect(() => {
    if (tourState.stepIndex === 0 && tourState.run) {
      props.onStart && props.onStart();
    }
  }, [props, tourState.run, tourState.stepIndex]);

  return (
    <TourContext.Provider
      value={{
        next,
        back,
        stop,
      }}
    >
      <Joyride
        callback={callback}
        scrollToFirstStep={false}
        showProgress={false}
        showSkipButton={false}
        styles={tourStyles}
        {...tourState}
        floaterProps={{
          offset: 15,
        }}
        steps={tourState.steps.map(
          (
            step: {
              header: string;
              content: React.ReactNode;
            },
            index: number,
            arr: Step[],
          ) => {
            return {
              ...step,
              content: (
                <div className="tour-step-container">
                  <h6>{step.header}</h6>
                  <p>{step.content}</p>
                  <TourNavigationButtons
                    tourName={props.tourName}
                    start={index === 0}
                    end={index === arr.length - 1}
                  />
                </div>
              ),
              disableBeacon: true,
              disableOverlayClose: true,
              hideFooter: true,
            };
          },
        )}
      />
    </TourContext.Provider>
  );
});
