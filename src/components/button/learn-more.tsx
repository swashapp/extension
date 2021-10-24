import React from 'react';

import { Button } from './button';

export function LearnMore(props: {
  position: string;
  size?: 'small' | 'large';
}): JSX.Element {
  return (
    <Button
      text={'Learn More'}
      size={props.size || 'large'}
      color={'white'}
      link={{
        url: '',
        external: true,
      }}
    />
  );
}
