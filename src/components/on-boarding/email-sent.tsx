import CircularProgress from '../circular-progress/circular-progress';
import React from 'react';
import Button from '../button/button';

export default function EmailSent() {
  return (
    <div className="on-boarding-progress-card email-sent">
      <CircularProgress type="completed" />
      <h2>Email sent successfully!</h2>
      <p>
        Once you've clicked the verification link in the email, you will go to
        Swash.
      </p>
      <div className="on-boarding-progress-button  email-sent-button">
        <Button
          text="I didn’t receive a verification email"
          link={false}
          color="secondary"
        />
      </div>
    </div>
  );
}
