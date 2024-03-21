import { MobileStepper } from '@mui/material';
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

import { UtilsService } from '../../service/utils-service';
import { SwashLogo } from '../swash-logo/swash-logo';

import '../../static/css/components/stepper.css';

export default forwardRef(function Stepper(
  props: PropsWithChildren<{
    display?: 'none';
    children: ReactElement[];
    activeStep?: number;
    steps?: number;
    flow: string[];
  }>,
  ref,
) {
  const [activeStep, setActiveStep] = useState<number>(props.activeStep || 0);

  const steps = useMemo(
    () => props.steps || Children.count(props.children),
    [props.children, props.steps],
  );

  const next = useCallback(() => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep < steps - 1 ? prevActiveStep + 1 : prevActiveStep,
    );
  }, [steps]);

  const back = useCallback(() => {
    setActiveStep((prevActiveStep) =>
      prevActiveStep > 0 ? prevActiveStep - 1 : prevActiveStep,
    );
  }, []);

  const change = useCallback((step: number) => {
    setActiveStep(step);
  }, []);

  useImperativeHandle(ref, () => ({
    next,
    back,
    change,
    activeStep,
    steps,
  }));

  return (
    <div className={'flex col relative stepper-container'}>
      <div className={'flex stepper-with-logo'}>
        <div className={'grow1'}>
          <SwashLogo />
        </div>
        <div className={'flex align-center grow1 stepper'}>
          <p className={'smaller bold stepper-step-number'}>
            {UtilsService.padWithZero(activeStep + 1)}
          </p>
          <MobileStepper
            className={'border-box stepper-mobile'}
            variant={'progress'}
            steps={steps}
            position={'static'}
            activeStep={activeStep}
            nextButton={null}
            backButton={null}
            LinearProgressProps={{
              className: 'stepper-linear-progress',
            }}
          />
          <p className={'smaller bold stepper-step-number'}>
            {UtilsService.padWithZero(steps)}
          </p>
        </div>
      </div>
      <div
        className={'relative stepper-swiper-container'}
        style={{ display: props?.display || 'block' }}
      >
        <SwipeableViews
          index={activeStep}
          onChangeIndex={change}
          disabled={true}
          enableMouseEvents
        >
          {Children.map(props.children, (child, index: number) => (
            <div className={'stepper-card'}>
              {activeStep === index ? child : <></>}
            </div>
          ))}
        </SwipeableViews>
      </div>
    </div>
  );
});
