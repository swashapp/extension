import React from 'react';

import { Circle } from './circle';

export function CircleOnLine(): JSX.Element {
  return (
    <div className={'on-line-container'} style={{ overflow: 'visible' }}>
      <div className={'solid-line'} style={{ zIndex: 1 }} />
      <div className={'on-line-container'}>
        <Circle className={'on-line-circle1'} color={'light-green'} />
        <Circle className={'on-line-circle2'} border={'black'} />
        <Circle
          className={'on-line-circle3'}
          border={'black'}
          dashed={'6 14'}
        />
      </div>
    </div>
  );
}
