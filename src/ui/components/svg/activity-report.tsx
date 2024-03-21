import { memo } from 'react';

export const ActivityReportIcon = memo(function ActivityReportIcon(props: {
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
          'M3 10C3 11.4834 3.43987 12.9334 4.26398 14.1668C5.08809 15.4001 6.25943 16.3614 7.62987 16.9291C9.00032 17.4968 10.5083 17.6453 11.9632 17.3559C13.418 17.0665 14.7544 16.3522 15.8033 15.3033C16.8522 14.2544 17.5665 12.918 17.8559 11.4632C18.1453 10.0083 17.9968 8.50032 17.4291 7.12987C16.8614 5.75943 15.9001 4.58809 14.6668 3.76398C13.4334 2.93987 11.9834 2.5 10.5 2.5C8.40329 2.50789 6.39081 3.32602 4.88333 4.78333L3.5 6'
        }
        stroke={'#141414'}
        strokeWidth={'1.8'}
        strokeLinecap={'square'}
        strokeLinejoin={'round'}
      />
      <path
        d={'M3 2.5V6.66667H7.16667'}
        stroke={'#141414'}
        strokeWidth={'1.8'}
        strokeLinecap={'round'}
        strokeLinejoin={'round'}
      />
      <path
        d={'M10.5 5.83203V9.9987L13.8333 11.6654'}
        stroke={'#141414'}
        strokeWidth={'1.8'}
        strokeLinecap={'round'}
        strokeLinejoin={'round'}
      />
    </svg>
  );
});
