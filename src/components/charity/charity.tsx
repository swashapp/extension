import React from 'react';

import { helper } from '../../core/webHelper';
import { Charity } from '../../types/storage/charity.type';
import { Button } from '../button/button';
import { FavButton } from '../button/fav';
import { Donate } from '../donate/donate';
import { StopDonation } from '../donate/stop-donation';
import { showPopup } from '../popup/popup';

export function Charity(props: {
  id: number;
  banner: string;
  logo: string;
  title: string;
  website: string;
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
        <div>
          <div className={'charity-title title'}>{props.title}</div>
          <div className={'charity-location'}>{props.location}</div>
        </div>
        <div className={'charity-text'}>{props.description}</div>
        <div className={'charity-actions'}>
          <div>
            {props.metadata?.auto_pay ? (
              <Button
                color={'secondary'}
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
                className={`charity-actions-donate`}
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
            <Button
              color={'secondary'}
              text={'Website'}
              link={{ url: props.website, newTab: true, external: true }}
              className={'charity-actions-website'}
            />
          </div>
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
