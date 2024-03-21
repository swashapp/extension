import { ReactNode, useEffect } from 'react';

import { ButtonColors } from '../../../enums/button.enum';
import { Button } from '../button/button';
import { WaitingProgressBar } from '../progress/waiting-progress';

import '../../../static/css/components/wait-for-done.css';

export function WaitForDone({
  className = '',
  onBack,
  onLoad,
}: {
  className?: string;
  onBack: () => void;
  onLoad: () => void;
}): ReactNode {
  useEffect(() => {
    onLoad();
  }, [onLoad]);

  return (
    <div className={'flex col gap40'}>
      <div className={className}>
        <div className={'flex col justify-center wait-for-done-container'}>
          <WaitingProgressBar />
        </div>
        <Button text={'Back'} color={ButtonColors.SECONDARY} onClick={onBack} />
      </div>
    </div>
  );
}
