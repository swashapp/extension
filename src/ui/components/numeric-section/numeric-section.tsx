import { ReactNode } from 'react';

import { Tooltip } from '../tooltip/tooltip';

import '../../../static/css/components/numeric-section.css';

export function NumericSection(props: {
  className?: string;
  title: string;
  value: number | string;
  image?: string;
  tooltip?: string | ReactNode;
}): ReactNode {
  const { className = '', title, value, image, tooltip } = props;
  return (
    <div className={`round no-overflow bg-white ${className}`}>
      <div
        className={`flex row align-center justify-between card2824 ${
          !image ? 'numeric-small' : ''
        }`}
      >
        <div className={'flex row gap24'}>
          {image ? (
            <div className={'flex center numeric-card-icon'}>
              <img src={image} alt={''} />
            </div>
          ) : null}
          <div className={`flex col`}>
            <div className={'flex row'}>
              <p className={'smaller'}>{title}</p>
              {tooltip ? <Tooltip text={tooltip} /> : null}
            </div>
            <h4>{value}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
