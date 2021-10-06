import { MobileStepper } from '@material-ui/core';
import { Children, PropsWithChildren } from 'react';
import {
  forwardRef,
  ReactElement,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import React from 'react';

import SwipeableViews from 'react-swipeable-views';

import FlexGrid from '../flex-grid/flex-grid';
import SwashLogo from '../swash-logo/swash-logo';

const padWithZero = (num: number) => String(num).padStart(2, '0');

export default forwardRef(function Stepper(
  props: PropsWithChildren<{
    display?: 'none';
    children: ReactElement[];
    activeStep?: number;
    steps?: number;
  }>,
  ref,
) {
  const [activeStep, setActiveStep] = useState<number>(props.activeStep || 0);

  const steps = useMemo(
    () => props.steps || Children.count(props.children),
    [props.children, props.steps],
  );

  const next = useCallback(() => {
    if (activeStep < steps - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  }, [setActiveStep, activeStep, steps]);

  const back = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  }, [setActiveStep, activeStep]);

  const change = useCallback(
    (step: number) => {
      setActiveStep(step);
    },
    [setActiveStep],
  );

  useImperativeHandle(ref, () => ({
    next,
    back,
    change,
    activeStep,
    steps,
  }));

  return (
    <div className={'stepper-container'}>
      <FlexGrid className={'stepper-with-logo'} column={2}>
        <SwashLogo />
        <div className="stepper-with-numbers">
          <div className={'stepper'}>
            <div className={'stepper-step-number'}>
              {padWithZero(activeStep + 1)}
            </div>
            <MobileStepper
              className={'stepper-mobile'}
              variant="progress"
              steps={steps}
              position="static"
              activeStep={activeStep}
              nextButton={null}
              backButton={null}
              LinearProgressProps={{
                className: 'stepper-linear-progress',
              }}
            />
            <div className={'stepper-step-number'}>{padWithZero(steps)}</div>
          </div>
        </div>
      </FlexGrid>
      <div
        className={'stepper-swiper-container'}
        style={{ display: props?.display || 'block' }}
      >
        <SwipeableViews
          index={activeStep}
          onChangeIndex={change}
          enableMouseEvents
        >
          {Children.map(props.children, (child) => (
            <div className="on-boarding-stepper-item">{child}</div>
          ))}
        </SwipeableViews>
      </div>
    </div>
  );
});
