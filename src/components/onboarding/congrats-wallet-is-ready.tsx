import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { RouteToPages } from '../../paths';

import { Button } from '../button/button';
import { CircularProgress } from '../circular-progress/circular-progress';

export function CongratsWalletIsReady(props: {
  type: 'imported' | 'created';
}): JSX.Element {
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
        <Link to={RouteToPages.wallet}>
          <Button text="Use Swash" link={false} />
        </Link>
      </div>
    </div>
  );
}
