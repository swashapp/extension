import { memo } from 'react';

export const CalendarIcon = memo(function CalendarIcon(props: {
  width?: number;
  height?: number;
}) {
  const { width = 20, height = 20 } = props;

  return (
    <svg
      xmlns={'http://www.w3.org/2000/svg'}
      width={width}
      height={height}
      viewBox={'0 0 20 20'}
      fill={'none'}
    >
      <path
        d={
          'M5.00008 3.33333V1.25H6.66675V3.33333H13.3334V1.25H15.0001V3.33333H18.3334V18.3333H1.66675V3.33333H5.00008ZM3.33341 5V7.5H16.6667V5H3.33341ZM16.6667 9.16667H3.33341V16.6667H16.6667V9.16667Z'
        }
        fill={'#232323'}
      />
    </svg>
  );
});
