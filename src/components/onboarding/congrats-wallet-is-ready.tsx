import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { AppContext } from '../../pages/app';

import { Button } from '../button/button';
import { CircularProgress } from '../circular-progress/circular-progress';
import { ToastMessage } from '../toast/toast-message';

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
          : 'Your Swash wallet has been created.'}
      </p>
      {props.type === 'created' ? (
        <p>Now you are part of the world’s first digital Data Union!</p>
      ) : (
        <></>
      )}
      <div className="onboarding-progress-button congrats-button">
        <Button
          text="Use Swash"
          loading={loading}
          link={false}
          onClick={() => {
            setLoading(true);
            window.helper
              .submitOnBoarding()
              .then(() => {
                setLoading(false);
                app.forceUpdate();
              })
              .catch((err: { message: string }) => {
                setLoading(false);
                toast(
                  <ToastMessage
                    type="error"
                    content={<>{err?.message || 'Something went wrong!'}</>}
                  />,
                );
              });
          }}
        />
      </div>
    </div>
  );
}
