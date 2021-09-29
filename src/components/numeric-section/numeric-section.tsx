import React from 'react';

export default function NumericSection(props: {
  layout?: 'layout1' | 'layout2';
  title: string;
  value: number | string;
  image?: string;
}) {
  const { layout = 'layout1', title, value, image } = props;
  return (
    <div className={`${'numeric-container'} ${!image ? 'numeric-small' : ''}`}>
      <div className={'numeric-icon-content'}>
        {image ? (
          <div className={'numeric-icon'}>
            <img src={image} alt={''} width={64} height={64} />
          </div>
        ) : (
          <></>
        )}
        <div className={'numeric-title-number'}>
          <div className={'numeric-title'}>{title}</div>
          <h4 className={'numeric-number'}>{value}</h4>
        </div>
      </div>
      {image ? <div className={'numeric-' + layout + '-image'} /> : <></>}
    </div>
  );
}
