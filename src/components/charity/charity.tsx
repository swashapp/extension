import React from 'react';

import { helper } from '../../core/webHelper';
import { Charity } from '../../types/storage/charity.type';
import { Button } from '../button/button';
import { FavButton } from '../button/fav';
import { Donate } from '../donate/donate';
import { showPopup } from '../popup/popup';

export function Charity(props: {
  id: number;
  banner: string;
  logo: string;
  title: string;
  location: string;
  description: string;
  wallet: string;
  metadata?: Charity;
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
        <div className={'charity-actions'}>
          <Button
            text={'Donate'}
            link={false}
            className={'charity-actions-button'}
            onClick={() => {
              showPopup({
                closable: false,
                closeOnBackDropClick: true,
                paperClassName: 'custom-popup',
                content: (
                  <Donate
                    id={props.id}
                    title={props.title}
                    address={props.wallet}
                  />
                ),
              });
            }}
          />
          <FavButton
            enable={props.metadata?.fav || false}
            onClick={async () => {
              await helper.toggleCharityLike(props.id);
            }}
          />
        </div>
      </div>
    </div>
  );
}
