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

import SwashLogo from 'url:../../static/images/logos/swash.svg';

import FlexGrid from '../flex-grid/flex-grid';

const padWithZero = (num: number) => String(num).padStart(2, '0');

export default forwardRef(function Stepper(
  props: PropsWithChildren<{
    display?: 'none';
    children: ReactElement[];
  }>,
  ref,
) {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = useMemo(() => Children.count(props.children), [props.children]);

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
        <div className={'stepper-logo'}>
          <img src={SwashLogo} alt={'Swash'} />
        </div>
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
          {props.children}
        </SwipeableViews>
      </div>
    </div>
  );
});
