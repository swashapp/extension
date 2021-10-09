import completedIcon from 'url:../../static/images/icons/progress-completed.png';
import Circle from '../drawing/circle';
import React from 'react';

export default function DataTransferCompleted() {
  return (
    <div className="data-transfer-popup-completed">
      <div className="progress-dashed">
        <Circle
          className={'progress-circle1'}
          border={'black'}
          dashed={'6 14'}
        />
        <div className={'progress-widget'}>
          <Circle className={'progress-circle6'} colorfulGradiant />
          <img className="progress-image" src={completedIcon} alt={''} />
        </div>
      </div>
      <h2>Transfer Completed!</h2>
      <p>
        Verify your transaction on{' '}
        <a href="" target="_blank" className="link-in-text">
          Blockscout
        </a>
      </p>
    </div>
  );
}
