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
        url: 'https://medium.com/swashapp/the-dawn-of-a-new-age-of-data-eff0d8b2f0a4',
        newTab: true,
        external: true,
      }}
    />
  );
}
