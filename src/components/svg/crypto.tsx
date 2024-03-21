import { memo } from 'react';

export const CryptoIcon = memo(function CryptoIcon(props: {
  width?: number;
  height?: number;
}) {
  const { width = 20, height = 20 } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox={'0 0 20 20'}
      fill={'none'}
      xmlns={'http://www.w3.org/2000/svg'}
    >
      <path
        d={
          'M9.99999 18.3337C14.6024 18.3337 18.3333 14.6027 18.3333 10.0003C18.3333 5.39795 14.6024 1.66699 9.99999 1.66699C5.39762 1.66699 1.66666 5.39795 1.66666 10.0003C1.66666 14.6027 5.39762 18.3337 9.99999 18.3337Z'
        }
        stroke={'#141414'}
        strokeWidth={'1.5'}
        strokeLinecap={'round'}
        strokeLinejoin={'round'}
      />
      <path
        d={
          'M13.0303 8.60973C12.5033 7.46313 11.3446 6.66699 9.99999 6.66699C8.15904 6.66699 6.66666 8.15938 6.66666 10.0003C6.66666 11.8413 8.15904 13.3337 9.99999 13.3337C11.2338 13.3337 12.311 12.6633 12.8874 11.667'
        }
        stroke={'#141414'}
        strokeWidth={'1.5'}
      />
      <path
        d={'M10 6.66667V5'}
        stroke={'#141414'}
        strokeWidth={'1.5'}
        strokeLinecap={'square'}
        strokeLinejoin={'round'}
      />
      <path
        d={'M10 14.9997V13.333'}
        stroke={'#141414'}
        strokeWidth={'1.5'}
        strokeLinecap={'square'}
        strokeLinejoin={'round'}
      />
    </svg>
  );
});
