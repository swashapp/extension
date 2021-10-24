import React, { useEffect } from 'react';

import { RouteToPages } from '../../paths';
import { Button } from '../button/button';
import { CircularProgress } from '../circular-progress/circular-progress';
import { Link } from '../link/link';

export function CongratsWalletIsReady(props: {
  type: 'imported' | 'created';
}): JSX.Element {
  useEffect(() => {
    window.helper.submitOnBoarding().then();
  }, []);

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
        <Link url={RouteToPages.wallet}>
          <Button text="Use Swash" link={false} />
        </Link>
      </div>
    </div>
  );
}
