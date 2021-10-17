import React, { memo } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import completedIcon from 'url:../../static/images/icons/progress-completed.png';

import Circle from '../drawing/circle';

export default memo(function DataTransferCompleted(props: {
  transactionId: string;
  sendToMainnet: boolean;
}) {
  return (
    <div className="data-transfer-popup-completed">
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
        {props.sendToMainnet ? (
          <>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://etherscan.io/tx/${props.transactionId}`}
            >
              Etherscan
            </a>
          </>
        ) : (
          <>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://blockscout.com/xdai/mainnet/tx/${props.transactionId}`}
            >
              Blockscout
            </a>
          </>
        )}
      </p>
    </div>
  );
});
