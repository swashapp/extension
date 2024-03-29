import React from 'react';

const completedIcon = '/static/images/icons/progress-completed.png';
const uploadingIcon = '/static/images/icons/uploading.png';

import { Circle } from '../drawing/circle';

export function CircularProgress(props: {
  type: 'loading' | 'completed' | 'uploading';
}): JSX.Element {
  return (
    <div className="progress-outer-circles">
      <div className="progress-arc">
        <Circle className={'progress-circle4'} border={'black'} />
      </div>
      <Circle className={'progress-circle5'} border={'black'} />
      <div className="progress-solid">
        <Circle className={'progress-circle2'} border={'black'} />
        <Circle className={'progress-circle3'} color={'soft-green'} />
        <div className="progress-dashed">
          <Circle
            className={'progress-circle1'}
            border={'black'}
            dashed={'6 14'}
          />
          <div
            className={`progress-widget ${
              props.type === 'loading' ? 'dot-pulse' : ''
            }`}
          >
            {props.type !== 'loading' ? (
              <>
                {props.type === 'completed' ? (
                  <Circle className={'progress-circle6'} colorfulGradient />
                ) : (
                  <></>
                )}
                <img
                  className="progress-image"
                  src={
                    props.type === 'uploading' ? uploadingIcon : completedIcon
                  }
                  alt={''}
                />
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
