import { memo } from 'react';

export const NextIcon = memo(function NextIcon(props: {
  width?: number;
  height?: number;
  color?: string;
}) {
  const { width = 20, height = 20, color = 'var(--color-black)' } = props;

  return (
    <svg
      xmlns={'http://www.w3.org/2000/svg'}
      width={width}
      height={height}
      viewBox={'0 0 20 20'}
      fill={'none'}
    >
      <path
        d={'M7.5 15L12.5 10L7.5 5'}
        stroke={color}
        strokeWidth={'2'}
        strokeLinecap={'square'}
      />
    </svg>
  );
});
