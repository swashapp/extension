import React from 'react';

import { Button } from '../button/button';
import { CircularProgress } from '../circular-progress/circular-progress';

export function EmailSent(): JSX.Element {
  return (
    <div className="onboarding-progress-card email-sent">
      <CircularProgress type="completed" />
      <h2>Email sent successfully!</h2>
      <p>
        Once you&apos;ve clicked the verification link in the email, you will go
        to Swash.
      </p>
      <div className="onboarding-progress-button  email-sent-button">
        <Button
          text="I didn’t receive a verification email"
          link={false}
          color="secondary"
        />
      </div>
    </div>
  );
}
