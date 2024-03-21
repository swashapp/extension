import { ReactElement, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { helper } from '../../core/webHelper';
import { AppContext } from '../../pages/app';

import { Button } from '../button/button';
import { ToastMessage } from '../toast/toast-message';

export function CongratsWalletIsReady(props: {
  type: 'imported' | 'created';
}): ReactElement {
  const app = useContext(AppContext);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    helper
      .submitOnBoarding()
      .then(() => {
        helper.isJoinedSwash().then();
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div
      className={'round flex col gap32 bg-white card relative onboarding-block'}
    >
      <img
        className={'absolute onboarding-close-button'}
        src={'/static/images/shape/cross.svg'}
        alt={'close'}
        width={10}
        height={10}
        onClick={() => {
          app.forceUpdate();
        }}
      />
      <h6>Congratulations!</h6>
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
      </p>
      <p className={'text-center'}>
        <img
          src={'/static/images/gif/turn-on-swash.gif'}
          alt={'turn on swash'}
          width={'50%'}
          height={'auto'}
        />
      </p>
      <p>Swash can only collect your data if you press the button below.</p>

      <div className={'onboarding-progress-button congrats-button'}>
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
                    type={'error'}
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
