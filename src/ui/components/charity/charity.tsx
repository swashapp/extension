import { ReactNode } from 'react';

import { ButtonColors } from '../../../enums/button.enum';
import { helper } from '../../../helper';
import { GetCharityInfoRes } from '../../../types/api/charity.type';
import { OngoingRes } from '../../../types/api/donation.type';
import { Button } from '../button/button';
import { FavButton } from '../button/fav';
import { Donate } from '../donate/donate';
import { StopDonation } from '../donate/stop-donation';
import { showPopup } from '../popup/popup';

import '../../../static/css/components/charity.css';

export function Charity({
  charity,
  favorite,
  ongoing,
  className,
  onDonate,
  onStop,
}: {
  charity: GetCharityInfoRes;
  favorite: boolean;
  ongoing?: OngoingRes;
  className?: string;
  onDonate?: (ongoing: OngoingRes) => void;
  onStop?: () => void;
}): ReactNode {
  return (
    <div className={`round no-overflow bg-lightest-grey charity ${className}`}>
      <div className={'charity-banner relative'}>
        <img
          src={charity.banner}
          alt={''}
          style={{
            objectFit: 'cover',
            width: 'inherit',
            height: 'inherit',
          }}
        />
        <img
          src={charity.logo}
          alt={charity.name}
          className={'flex center no-overflow absolute charity-logo'}
        />
      </div>
      <div className={'flex col justify-between border-box charity-body gap20'}>
        <div>
          <p className={'larger bold'}>{charity.name}</p>
          <p className={'small'}>{charity.location}</p>
        </div>
        <p>{charity.description}</p>
        <div className={'flex align-center justify-between'}>
          <div className={'flex align-center gap12'}>
            {ongoing ? (
              <Button
                text={'Stop Donating'}
                className={'charity-action'}
                color={ButtonColors.SECONDARY}
                onClick={() => {
                  showPopup({
                    closable: false,
                    closeOnBackDropClick: true,
                    paperClassName: 'popup custom',
                    content: (
                      <StopDonation
                        charity={charity}
                        ongoing={ongoing}
                        onStop={onStop}
                      />
                    ),
                  });
                }}
              />
            ) : (
              <Button
                text={'Donate'}
                className={`charity-action`}
                onClick={() => {
                  showPopup({
                    closable: false,
                    closeOnBackDropClick: true,
                    paperClassName: 'popup custom',
                    content: <Donate charity={charity} onDonate={onDonate} />,
                  });
                }}
              />
            )}
            <Button
              text={'Website'}
              className={'charity-action'}
              color={ButtonColors.SECONDARY}
              link={{ url: charity.website, newTab: true, external: true }}
            />
          </div>
          <FavButton
            enable={favorite}
            onClick={async (status: boolean) => {
              if (status)
                await helper('preferences').addCharityToFavorite(charity.id);
              else
                await helper('preferences').removeCharityToFavorite(charity.id);
            }}
          />
        </div>
      </div>
    </div>
  );
}
