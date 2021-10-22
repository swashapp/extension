import React, { ReactElement } from 'react';

export function NumericSection(props: {
  layout?: 'layout1' | 'layout2' | ReactElement;
  title: string;
  value: number | string;
  image?: string;
  tourClassName?: string;
}): JSX.Element {
  const { layout = 'layout1', title, value, image } = props;
  return (
    <div className={`${'numeric-container'} ${!image ? 'numeric-small' : ''}`}>
      <div className={'numeric-icon-content'}>
        {image ? (
          <div className={'card-icon'}>
            <img src={image} alt={''} />
          </div>
        ) : (
          <></>
        )}
        <div className={`numeric-title-number ${props.tourClassName}`}>
          <div className={'numeric-title'}>{title}</div>
          <div className={'numeric-number title'}>{value}</div>
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
  );
}
