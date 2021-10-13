import React, { memo } from 'react';

import Circle from './circle';
import CircleOnLine from './circle-on-line';

export default memo(function BackgroundTheme(props: {
  layout?: 'layout1' | 'layout2' | 'layout3';
}) {
  const { layout = 'layout1' } = props;
  return (
    <>
      <Circle className={'theme-circle1'} colorful />
      <Circle className={'theme-circle2'} border={'black'} dashed={'6 14'} />
      {layout === 'layout3' ? (
        <></>
      ) : (
        <>
          <Circle
            className={'theme-circle3 theme-' + layout + '-circle3'}
            border={'black'}
            dashed={'6 14'}
          />
          <div className="circle-on-line">
            <CircleOnLine />
          </div>
        </>
      )}
    </>
  );
});
