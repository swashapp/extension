import React, { ReactElement } from 'react';

const completedIcon = '/static/images/icons/progress-completed.png';
const uploadingIcon = '/static/images/icons/uploading.png';

import '../../static/css/components/circular-progress.css';

import { Circle } from '../drawing/circle';

export function CircularProgress(props: {
  type: 'loading' | 'completed' | 'uploading';
}): ReactElement {
  return (
    <div className={'circular-progress-outer-circles'}>
      <div className={'circular-progress-arc'}>
        <Circle className={'circular-progress-circle4'} border={'black'} />
      </div>
      <Circle className={'circular-progress-circle5'} border={'black'} />
      <div className={'circular-progress-solid'}>
        <Circle className={'circular-progress-circle2'} border={'black'} />
        <Circle className={'circular-progress-circle3'} color={'soft-green'} />
        <div className={'circular-progress-dashed'}>
          <Circle
            className={'circular-progress-circle1'}
            border={'black'}
            dashed={'6 14'}
          />
          <div
            className={`circular-progress-widget ${
              props.type === 'loading' ? 'dot-pulse' : ''
            }`}
          >
            {props.type !== 'loading' ? (
              <>
                {props.type === 'completed' ? (
                  <Circle
                    className={'circular-progress-circle6'}
                    colorfulGradient
                  />
                ) : (
                  <></>
                )}
                <img
                  className={'circular-progress-image'}
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
