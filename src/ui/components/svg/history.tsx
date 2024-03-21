import { memo } from 'react';

export const HistoryIcon = memo(function HistoryIcon(props: {
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
          'M13.334 18.3346H15.0007C15.4173 18.3346 15.834 18.168 16.1673 17.8346C16.5007 17.5013 16.6673 17.0846 16.6673 16.668V6.2513L12.084 1.66797H5.00065C4.58398 1.66797 4.16732 1.83464 3.83398 2.16797C3.50065 2.5013 3.33398 2.91797 3.33398 3.33464V5.83464'
        }
        stroke={'#141414'}
        strokeWidth={'1.5'}
        strokeLinecap={'square'}
        strokeLinejoin={'round'}
      />
      <path
        d={'M11.666 1.66797V6.66797H16.666'}
        stroke={'#141414'}
        strokeWidth={'1.5'}
        strokeLinecap={'round'}
        strokeLinejoin={'round'}
      />
      <path
        d={
          'M6.66602 18.332C9.42744 18.332 11.666 16.0935 11.666 13.332C11.666 10.5706 9.42744 8.33203 6.66602 8.33203C3.90459 8.33203 1.66602 10.5706 1.66602 13.332C1.66602 16.0935 3.90459 18.332 6.66602 18.332Z'
        }
        stroke={'#141414'}
        strokeWidth={'1.5'}
        strokeLinecap={'round'}
        strokeLinejoin={'round'}
      />
      <path
        d={'M7.91602 14.5846L6.66602 13.543V11.668'}
        stroke={'#141414'}
        strokeWidth={'1.5'}
        strokeLinecap={'round'}
        strokeLinejoin={'round'}
      />
    </svg>
  );
});
