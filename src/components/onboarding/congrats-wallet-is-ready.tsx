import React, { memo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { RouteToPages } from '../../paths';

import Button from '../button/button';
import CircularProgress from '../circular-progress/circular-progress';

export default memo(function CongratsWalletIsReady(props: {
  type: 'imported' | 'created';
}) {
  const history = useHistory();
  const onUseSwash = useCallback(() => {
    window.helper.submitOnBoarding().then(() => {
      history.push(RouteToPages.wallet);
    });
  }, [history]);
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
        <Button text="Use Swash" link={false} onClick={onUseSwash} />
      </div>
    </div>
  );
});
