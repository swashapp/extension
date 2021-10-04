import React from 'react';
import Circle from './circle';
import CircleOnLine from './circle-on-line';

export default function BackgroundTheme() {
  return (
    <>
      <Circle className={'theme-circle1'} colorful />
      <Circle className={'theme-circle2'} border={'black'} dashed={'6 14'} />
      <Circle className={'theme-circle3'} border={'black'} dashed={'6 14'} />
      <div className="circle-on-line">
        <CircleOnLine />
      </div>
    </>
  );
}
