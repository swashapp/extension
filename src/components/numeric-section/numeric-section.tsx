import { ReactElement } from 'react';

import { Tooltip } from '../tooltip/tooltip';

import '../../static/css/components/numeric-section.css';

export function NumericSection(props: {
  layout?: 'layout1' | 'layout2' | ReactElement;
  title: string;
  tooltip?: string | ReactElement;
  value: number | string;
  image?: string;
  className?: string;
}): ReactElement {
  const { layout = 'layout1', title, value, image, className = '' } = props;
  return (
    <div className={`round no-overflow bg-white ${className}`}>
      <div
        className={`flex row align-center justify-between card2 ${
          !image ? 'numeric-small' : ''
        }`}
      >
        <div className={'flex row gap24'}>
          {image ? (
            <div className={'flex center numeric-card-icon'}>
              <img src={image} alt={''} />
            </div>
          ) : (
            <></>
          )}
          <div className={`flex col`}>
            <div className={'flex row'}>
              <p className={'smaller'}>{title}</p>
              {props.tooltip ? <Tooltip text={props.tooltip} /> : <></>}
            </div>
            <h4>{value}</h4>
          </div>
        </div>
        {layout ? (
          layout === 'layout1' || layout === 'layout2' ? (
            <div className={'numeric-' + layout + '-image'} />
          ) : (
            layout
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
