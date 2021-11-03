import React, { useContext, useState } from 'react';

import { AppContext } from '../../pages/app';

import { Button } from '../button/button';
import { CircularProgress } from '../circular-progress/circular-progress';

export function CongratsWalletIsReady(props: {
  type: 'imported' | 'created';
}): JSX.Element {
  const app = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <div className="onboarding-progress-card">
      <CircularProgress type="completed" />
      <h2>Congratulations!</h2>
      <p>
        {props.type === 'imported'
          ? 'Configuration is imported successfully.'
          : 'Your Swash wallet is created.'}
      </p>
      {props.type === 'created' ? (
        <p>Now you are part of the world’s first digital Data Union!</p>
      ) : (
        <></>
      )}
      <div className="onboarding-progress-button  congrats-button">
        <Button
          text="Use Swash"
          loading={loading}
          link={false}
          onClick={() => {
            setLoading(true);
            window.helper.submitOnBoarding().then(() => {
              setLoading(false);
              app.forceUpdate();
            });
          }}
        />
      </div>
    </div>
  );
}
