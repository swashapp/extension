import { memo } from 'react';

export const DollarIcon = memo(function DollarIcon(props: {
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
        stroke={'#232323'}
        strokeWidth={'1.66667'}
        strokeLinecap={'round'}
        strokeLinejoin={'round'}
      />
      <path
        d={
          'M13.3333 6.66699H8.33332C7.8913 6.66699 7.46737 6.84259 7.15481 7.15515C6.84225 7.46771 6.66666 7.89163 6.66666 8.33366C6.66666 8.77569 6.84225 9.19961 7.15481 9.51217C7.46737 9.82473 7.8913 10.0003 8.33332 10.0003H11.6667C12.1087 10.0003 12.5326 10.1759 12.8452 10.4885C13.1577 10.801 13.3333 11.225 13.3333 11.667C13.3333 12.109 13.1577 12.5329 12.8452 12.8455C12.5326 13.1581 12.1087 13.3337 11.6667 13.3337H6.66666'
        }
        stroke={'#232323'}
        strokeWidth={'1.66667'}
        strokeLinecap={'square'}
        strokeLinejoin={'round'}
      />
      <path
        d={'M10 15V5'}
        stroke={'#232323'}
        strokeWidth={'1.66667'}
        strokeLinecap={'square'}
        strokeLinejoin={'round'}
      />
    </svg>
  );
});
