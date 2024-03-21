import React, { ReactElement } from 'react';

import { helper } from '../../core/webHelper';
import { Charity } from '../../types/storage/charity.type';
import { Button } from '../button/button';
import { FavButton } from '../button/fav';
import { Donate } from '../donate/donate';
import { StopDonation } from '../donate/stop-donation';
import { showPopup } from '../popup/popup';

import '../../static/css/components/charity.css';

export function Charity(props: {
  id: number;
  banner: string;
  logo: string;
  title: string;
  website: string;
  location: string;
  description: string;
  wallet: string;
  className?: string;
  metadata?: Charity;
  callback?: () => void;
}): ReactElement {
  const {
    id,
    banner,
    logo,
    title,
    website,
    location,
    description,
    wallet,
    className,
    metadata,
    callback,
  } = props;

  return (
    <div className={`round no-overflow bg-lightest-grey charity ${className}`}>
      <div className={'charity-banner relative'}>
        <img
          src={banner}
          alt={''}
          style={{
            objectFit: 'cover',
            width: 'inherit',
            height: 'inherit',
          }}
        />
        <img
          src={logo}
          alt={''}
          className={'flex center no-overflow absolute charity-logo'}
        />
      </div>
      <div className={'flex col justify-between border-box charity-body gap20'}>
        <div>
          <p className={'larger bold'}>{title}</p>
          <p className={'small'}>{location}</p>
        </div>
        <p>{description}</p>
        <div className={'flex align-center justify-between'}>
          <div className={'flex align-center gap12'}>
            {metadata?.auto_pay ? (
              <Button
                color={'secondary'}
                text={'Stop Donating'}
                link={false}
                className={'charity-action'}
                onClick={() => {
                  showPopup({
                    closable: false,
                    closeOnBackDropClick: true,
                    paperClassName: 'popup custom',
                    content: (
                      <StopDonation
                        id={id}
                        title={title}
                        percent={metadata?.percentage || '0'}
                        callback={callback}
                      />
                    ),
                  });
                }}
              />
            ) : (
              <Button
                text={'Donate'}
                link={false}
                className={`charity-action`}
                onClick={() => {
                  showPopup({
                    closable: false,
                    closeOnBackDropClick: true,
                    paperClassName: 'popup custom',
                    content: (
                      <Donate
                        id={id}
                        title={title}
                        address={wallet}
                        callback={callback}
                      />
                    ),
                  });
                }}
              />
            )}
            <Button
              color={'secondary'}
              text={'Website'}
              link={{ url: website, newTab: true, external: true }}
              className={'charity-action'}
            />
          </div>
          <FavButton
            enable={metadata?.fav || false}
            onClick={async () => {
              await helper.toggleCharityLike(id);
            }}
          />
        </div>
      </div>
    </div>
  );
}
