import { memo } from 'react';

export const BackIcon = memo(function BackIcon(props: {
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
      viewBox={'0 0 24 24'}
      fill={'none'}
    >
      <path
        d={'M11 5.99951L5 11.9995L11 17.9995'}
        stroke={color}
        strokeWidth={'2'}
        strokeLinecap={'square'}
        strokeLinejoin={'round'}
      />
      <path
        d={'M6 11.9995H19'}
        stroke={color}
        strokeWidth={'2'}
        strokeLinecap={'square'}
        strokeLinejoin={'round'}
      />
    </svg>
  );
});
