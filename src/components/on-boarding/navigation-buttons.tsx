import React from 'react';
import Button from '../button/button';

export default function NavigationButtons(props: {
  nextButtonText?: string;
  onSubmit: () => void;
  onBack: () => void;
  loading?: boolean;
  disableNext?: boolean;
  disableBack?: boolean;
}) {
  return (
    <div className="flex-row on-boarding-nav-buttons">
      <div className="form-button">
        <Button
          color="secondary"
          text="Back"
          link={false}
          onClick={props.onBack}
          disabled={props.disableBack}
        />
      </div>
      <div className="form-button">
        <Button
          color="primary"
          text={props.nextButtonText || 'Next'}
          link={false}
          loading={props.loading}
          onClick={props.onSubmit}
          disabled={props.disableNext}
        />
      </div>
    </div>
  );
}
