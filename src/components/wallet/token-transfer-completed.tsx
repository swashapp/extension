import React, { ReactElement } from 'react';

import { Circle } from '../drawing/circle';

const completedIcon = '/static/images/icons/progress-completed.png';

export function TokenTransferCompleted(props: {
  transactionId: string;
}): ReactElement {
  return (
    <div className="token-transfer-popup-completed">
      <div className="progress-dashed">
        <Circle
          className={'progress-circle1'}
          border={'black'}
          dashed={'6 14'}
        />
        <div className={'progress-widget'}>
          <Circle className={'progress-circle6'} colorfulGradient />
          <img className="progress-image" src={completedIcon} alt={''} />
        </div>
      </div>
      <h2>Transfer Completed!</h2>
      <p>
        Verify your transaction on{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://gnosisscan.io/tx/${props.transactionId}`}
        >
          GnosisScan
        </a>
      </p>
    </div>
  );
}
