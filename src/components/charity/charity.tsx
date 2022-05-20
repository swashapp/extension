import React from 'react';

import { Button } from '../button/button';
import { FavButton } from '../button/fav';
import { Donate } from '../donate/donate';
import { showPopup } from '../popup/popup';

export function Charity(props: {
  banner: string;
  logo: string;
  title: string;
  location: string;
  description: string;
  supporters: number;
  donated: number;
  yours: number;
}): JSX.Element {
  return (
    <div className={'charity'}>
      <div className={'charity-banner'}>
        <img
          src={props.banner}
          alt={''}
          style={{
            objectFit: 'cover',
            width: 'inherit',
            height: 'inherit',
          }}
        />
        <div className={'charity-logo'}>
          <img
            src={props.logo}
            alt={''}
            style={{
              height: 'fit-content',
              width: 'fit-content',
            }}
          />
        </div>
      </div>
      <div className={'charity-body'}>
        <div className={'charity-title title'}>{props.title}</div>
        <div className={'charity-location'}>{props.location}</div>
        <div className={'charity-text'}>{props.description}</div>
        <div className={'charity-stats'}>
          <div className={'stats-box'}>
            <div className={'stats-title'}>Supporters</div>
            <div className={'stats-number title'}>{props.supporters}</div>
          </div>
          <div className={'stats-box'}>
            <div className={'stats-title'}>Donated</div>
            <div className={'stats-number title'}>${props.donated}</div>
          </div>
          <div className={'stats-box'}>
            <div className={'stats-title'}>By You</div>
            <div className={'stats-number title'}>${props.yours}</div>
          </div>
        </div>
        <div className={'charity-actions'}>
          <Button
            text={'Donate'}
            link={false}
            className={'charity-actions-button'}
            onClick={() => {
              showPopup({
                closable: false,
                closeOnBackDropClick: true,
                paperClassName: 'charity-payment',
                content: <Donate title={props.title} />,
              });
            }}
          />
          <FavButton
            onClick={() => {
              console.log('');
            }}
          />
        </div>
      </div>
    </div>
  );
}
