export interface IStepper {
  next: () => void;
  back: () => void;
  change: (step: number) => void;
  activeStep: number;
  steps: number;
}
