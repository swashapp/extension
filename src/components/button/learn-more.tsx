import React from 'react';

import { Button } from './button';

export function LearnMore(props: {
  position: string;
  size?: 'small' | 'large';
  link?: string;
}): JSX.Element {
  return (
    <Button
      text={'Learn More'}
      size={props.size || 'large'}
      color={'secondary'}
      link={{
        url: props.link || '',
        newTab: true,
        external: true,
      }}
    />
  );
}
