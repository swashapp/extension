import React, { ReactElement } from 'react';

import { Button } from '../button/button';

export function NavigationButtons(props: {
  nextButtonText?: string;
  onSubmit: () => void;
  onBack: () => void;
  loading?: boolean;
  disableNext?: boolean;
  disableBack?: boolean;
}): ReactElement {
  return (
    <div className={'flex row align-center justify-between'}>
      <Button
        className={'onboarding-button'}
        color={'secondary'}
        text={'Back'}
        link={false}
        onClick={props.onBack}
        disabled={props.disableBack}
      />
      <Button
        className={'onboarding-button'}
        color={'primary'}
        text={props.nextButtonText || 'Next'}
        link={false}
        loading={props.loading}
        onClick={props.onSubmit}
        disabled={props.disableNext}
      />
    </div>
  );
}
