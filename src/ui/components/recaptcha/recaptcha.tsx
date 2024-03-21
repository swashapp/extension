import { useEffect, useState } from 'react';

import { ButtonColors } from '../../../enums/button.enum';
import { WebsiteURLs } from '../../../paths';
import { Button } from '../button/button';
import { WaitingProgressBar } from '../progress/waiting-progress';

import '../../../static/css/components/recaptcha.css';

export function Recaptcha({
  className = '',
  onBack,
  onTokenReceived,
}: {
  className?: string;
  onBack: () => void;
  onTokenReceived: (token: string) => void;
}) {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    window.onmessage = (event: MessageEvent<{ token: string }>) => {
      onTokenReceived(event.data.token);
    };
  }, [onTokenReceived]);

  return (
    <div className={'flex col gap40'}>
      <div className={className}>
        <div className={'flex col justify-center recaptcha-container'}>
          {visible ? null : <WaitingProgressBar />}
          <iframe
            title={'Human Check'}
            src={WebsiteURLs.recaptcha}
            scrolling={'no'}
            style={{
              height: '100%',
              border: 'none',
              overflow: 'hidden',
              display: visible ? 'unset' : 'none',
            }}
            onLoad={() => setVisible(true)}
          >
            <p>Your browser does not support iframe.</p>
          </iframe>
        </div>
        <Button text={'Back'} color={ButtonColors.SECONDARY} onClick={onBack} />
      </div>
    </div>
  );
}
