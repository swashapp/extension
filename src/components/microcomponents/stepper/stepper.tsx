import {
  forwardRef,
  ReactElement,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

import { Children, PropsWithChildren } from 'react';

import styles from './stepper.module.css';
import { MobileStepper } from '@material-ui/core';
import React from 'react';

import SwipeableViews from 'react-swipeable-views';
import FlexGrid from '../flex-grid/flex-grid';

import SwashLogo from 'url:../../../statics/images/logos/swash.svg';

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
    <div className={styles.container}>
      <FlexGrid className={styles.stepperWithLogo} column={2}>
        <div className={styles.logo}>
          <img src={SwashLogo} alt={'Swash'} />
        </div>
        <div className={styles.stepper}>
          <div className={styles.stepNumber}>{padWithZero(activeStep + 1)}</div>
          <MobileStepper
            className={styles.mobileStepper}
            variant="progress"
            steps={steps}
            position="static"
            activeStep={activeStep}
            nextButton={null}
            backButton={null}
            LinearProgressProps={{
              className: styles.linearProgress,
            }}
          />
          <div className={styles.stepNumber}>{padWithZero(steps)}</div>
        </div>
      </FlexGrid>
      <div
        className={styles.swiperContainer}
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
