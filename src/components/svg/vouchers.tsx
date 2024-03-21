import { memo } from 'react';

export const VouchersIcon = memo(function VouchersIcon(props: {
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
          'M3.33417 1.66699V18.3337L5.00083 17.5003L6.6675 18.3337L8.33417 17.5003L10.0008 18.3337L11.6675 17.5003L13.3342 18.3337L15.0008 17.5003L16.6675 18.3337V1.66699L15.0008 2.50033L13.3342 1.66699L11.6675 2.50033L10.0008 1.66699L8.33417 2.50033L6.6675 1.66699L5.00083 2.50033L3.33417 1.66699Z'
        }
        stroke={'#232323'}
        strokeWidth={'1.38889'}
        strokeLinecap={'round'}
        strokeLinejoin={'round'}
      />
      <path
        d={
          'M13.3325 6.66699H8.3325C7.89047 6.66699 7.46655 6.84259 7.15399 7.15515C6.84143 7.46771 6.66583 7.89163 6.66583 8.33366C6.66583 8.77569 6.84143 9.19961 7.15399 9.51217C7.46655 9.82473 7.89047 10.0003 8.3325 10.0003H11.6658C12.1079 10.0003 12.5318 10.1759 12.8443 10.4885C13.1569 10.801 13.3325 11.225 13.3325 11.667C13.3325 12.109 13.1569 12.5329 12.8443 12.8455C12.5318 13.1581 12.1079 13.3337 11.6658 13.3337H6.66583'
        }
        stroke={'#232323'}
        strokeWidth={'1.38889'}
        strokeLinecap={'square'}
        strokeLinejoin={'round'}
      />
      <path
        d={'M10 14.1663V5.83301'}
        stroke={'#232323'}
        strokeWidth={'1.38889'}
        strokeLinecap={'square'}
        strokeLinejoin={'round'}
      />
    </svg>
  );
});
