import React from 'react';

import { helper } from '../../core/webHelper';
import { Charity } from '../../types/storage/charity.type';
import { Button } from '../button/button';
import { FavButton } from '../button/fav';
import { DONATION_TOUR_CLASS } from '../components-tour/donation-tour';
import { Donate } from '../donate/donate';
import { StopDonation } from '../donate/stop-donation';
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
  callback?: () => void;
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
          {props.metadata?.auto_pay ? (
            <Button
              color={'white'}
              text={'Stop Donating'}
              link={false}
              className={'charity-actions-stop'}
              onClick={() => {
                showPopup({
                  closable: false,
                  closeOnBackDropClick: true,
                  paperClassName: 'custom-popup',
                  content: (
                    <StopDonation
                      id={props.id}
                      title={props.title}
                      percent={props.metadata?.percentage || '0'}
                      callback={props.callback}
                    />
                  ),
                });
              }}
            />
          ) : (
            <Button
              text={'Donate'}
              link={false}
              className={`charity-actions-donate ${
                props.id === 1 ? DONATION_TOUR_CLASS.MAKE_DONATION : ''
              }`}
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
                      callback={props.callback}
                    />
                  ),
                });
              }}
            />
          )}
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
