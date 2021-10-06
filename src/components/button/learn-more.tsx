import React, { memo } from 'react';

import Button from './button';

export default memo(function LearnMore(props: {
  position: string;
  size?: 'small' | 'large';
}) {
  return (
    <Button
      text={'Learn More'}
      size={props.size || 'large'}
      color={'white'}
      link={{
        url: '',
        event: 'LearMoreSwashButton',
        position: props.position,
      }}
    />
  );
});
