import React, {
  forwardRef,
  PropsWithChildren,
  useCallback,
  useImperativeHandle,
  useMemo,
  useReducer,
} from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS, Step } from 'react-joyride';

const tourStyles = {
  spotlight: {
    borderRadius: '12px',
    padding: 0,
    backgroundColor: 'var(--white)',
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
      '0px 10px 20px rgba(44, 62, 62, 0.04), 0px 2px 6px rgba(44, 62, 62, 0.04), 0px 0px 1px rgba(44, 62, 62, 0.04)',
    borderRadius: 12,
    padding: 0,
    margin: 0,
  },
  overlay: {
    mixBlendMode: 'overlay',
  },
  options: {
    zIndex: 10000,
  },
};

export default forwardRef(function Tour(
  props: PropsWithChildren<{ steps: Step[] }>,
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
  const reducer = useCallback((state = INITIAL_STATE, action) => {
    switch (action.type) {
      // start the tour
      case 'START':
        return { ...state, run: true };
      // Reset to 0th step
      case 'RESET':
        return { ...state, stepIndex: 0 };
      // Stop the tour
      case 'STOP':
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
  }, []);
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
    [dispatch],
  );

  const start = useCallback(() => dispatch({ type: 'START' }), [dispatch]);
  const next = useCallback(() => dispatch({ type: 'NEXT' }), [dispatch]);
  const back = useCallback(() => dispatch({ type: 'PREV' }), [dispatch]);
  const stop = useCallback(() => dispatch({ type: 'STOP' }), [dispatch]);

  useImperativeHandle(ref, () => ({
    start,
    next,
    back,
    stop,
  }));

  return (
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
      steps={tourState.steps.map((step: Step) => {
        return {
          ...step,
          content: <div className="tour-step-container">{step.content}</div>,
          disableBeacon: true,
          disableOverlayClose: true,
          hideFooter: true,
        };
      })}
    />
  );
});
