import { memo } from 'react';

export const ClockIcon = memo(function ClockIcon(props: {
  width?: number;
  height?: number;
}) {
  const { width = 20, height = 20 } = props;

  return (
    <svg
      xmlns={'http://www.w3.org/2000/svg'}
      width={width}
      height={height}
      viewBox={'0 0 21 20'}
      fill={'none'}
    >
      <path
        d={
          'M10.5 18C14.9183 18 18.5 14.4183 18.5 10C18.5 5.58173 14.9183 2 10.5 2C6.08173 2 2.5 5.58173 2.5 10C2.5 14.4183 6.08173 18 10.5 18Z'
        }
        stroke={'#232323'}
        strokeWidth={'1.66667'}
        strokeLinecap={'round'}
        strokeLinejoin={'round'}
      />
      <path
        d={'M10.5 5.19922V9.99923H14.1'}
        stroke={'#232323'}
        strokeWidth={'1.66667'}
        strokeLinecap={'round'}
        strokeLinejoin={'round'}
      />
    </svg>
  );
});
