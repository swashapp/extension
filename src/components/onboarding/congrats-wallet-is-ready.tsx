import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { helper } from '../../core/webHelper';
import { AppContext } from '../../pages/app';

import { RouteToPages } from '../../paths';
import { Button } from '../button/button';
import { ToastMessage } from '../toast/toast-message';

export function CongratsWalletIsReady(props: {
  type: 'imported' | 'created';
}): JSX.Element {
  const app = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    helper
      .isJoinedSwash()
      .then(() => {
        helper.submitOnBoarding().then();
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="onboarding-progress-card onboarding-congrats-card">
      <div
        className={'close-button'}
        onClick={() => {
          app.forceUpdate();
        }}
      >
        <img
          src={'/static/images/shape/cross.svg'}
          alt={'close'}
          width={10}
          height={10}
        />
      </div>
      <h2>Congratulations!</h2>
      <p>
        {props.type === 'imported'
          ? 'Configuration imported successfully.'
          : 'Your Swash wallet has been created.'}
      </p>
      <p className={'onboarding-congratz-message'}>
        When you use Swash, you’re in control of the data you share. You can
        always control what data Swash collects in the ‘Data’ page of the
        extension, or pause data collection by turning the toggle off anytime
        from the Swash popup window.
        <br />
        <br />
        <img
          src={'/static/images/gif/turn-on-swash.gif'}
          alt={'turn on swash'}
        />
        <br />
        Swash can only collect your data if you press the button below.
      </p>

      <div className="onboarding-progress-button congrats-button">
        <Button
          text="Turn Swash On"
          loading={loading}
          link={false}
          onClick={() => {
            setLoading(true);
            helper
              .start()
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
