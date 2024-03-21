import { memo } from 'react';

export const CloseIcon = memo(function CloseIcon(props: {
  width?: number;
  height?: number;
}) {
  const { width = 20, height = 20 } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox={'0 0 24 24'}
      fill={'none'}
      xmlns={'http://www.w3.org/2000/svg'}
    >
      <path
        d={'M20.86 2.22559L2.19336 20.8923'}
        stroke={'#141414'}
        strokeWidth={'3.09677'}
        strokeLinecap={'square'}
        strokeLinejoin={'round'}
      />
      <path
        d={'M2.19336 2.22559L20.86 20.8923'}
        stroke={'#141414'}
        strokeWidth={'3.09677'}
        strokeLinecap={'square'}
        strokeLinejoin={'round'}
      />
    </svg>
  );
});
