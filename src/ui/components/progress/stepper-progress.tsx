import {
  Stepper,
  Step,
  StepLabel,
  styled,
  stepConnectorClasses,
  StepConnector,
  StepIconProps,
} from "@mui/material";
import clsx from "clsx";

import DoneIcon from "~/images/icons/circle-check.svg?react";
import InProgressIcon from "~/images/icons/circle-circle.svg?react";
import WaitingIcon from "~/images/icons/circle-empty.svg?react";

import styles from "./stepper-progress.module.css";

const StatusColor = {
  pending: "var(--color-soft-yellow)",
  error: "var(--color-red)",
  success: "var(--color-soft-green)",
};

const Connector = styled(StepConnector)(
  ({ status }: { status: keyof typeof StatusColor }) => ({
    [`&`]: {
      left: "calc(-50% + 14px)",
      right: "calc(50% + 14px)",
    },
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 13,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundColor: StatusColor[status],
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundColor: StatusColor[status],
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 2,
      border: 0,
      backgroundColor: "var(--color-light-grey)",
    },
  }),
);

function StepIcon(props: StepIconProps & { status: string }) {
  const { active, completed, className, status } = props;

  if (active)
    return <InProgressIcon className={clsx(className, styles[status])} />;
  else if (completed)
    return <DoneIcon className={clsx(className, styles[status])} />;
  else return <WaitingIcon className={className} />;
}

export function StepperProgress({
  steps,
  status,
  activeStep,
}: {
  steps: { text: string }[];
  status: "pending" | "error" | "success";
  activeStep: number;
}) {
  return (
    <Stepper
      alternativeLabel
      activeStep={activeStep}
      connector={<Connector status={status} />}
    >
      {steps.map(({ text }) => (
        <Step key={text}>
          <StepLabel
            StepIconComponent={(props: StepIconProps) => (
              <StepIcon status={status} {...props} />
            )}
          >
            <p className={clsx("smaller", styles.text)}>{text}</p>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
