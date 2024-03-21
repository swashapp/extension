import React, { ReactElement } from 'react';

export interface VerificationBannerItem {
  text: ReactElement;
  image: string;
  className: string;
  verified: boolean;
}

const diamond = '/static/images/icons/profile/diamond.svg';
const swash = '/static/images/icons/profile/swash.svg';
const wallet = '/static/images/icons/profile/wallet.svg';

const imgStyle = {
  marginBottom: '-0.25em',
};

export const VerificationBannerItems = [
  {
    text: (
      <>
        To withdraw <img src={wallet} alt={'wallet'} style={imgStyle} /> your{' '}
        <img src={diamond} alt={'diamond'} style={imgStyle} /> earnings, verify
        your profile.
      </>
    ),
    image: '/static/images/icons/verification-banner/person.png',
    className: 'unverified',
    verified: false,
  },
  {
    text: (
      <>
        Congrats! <img src={swash} alt={'swash'} style={imgStyle} /> Your
        profile is now verified
      </>
    ),
    image: '/static/images/icons/verification-banner/box.png',
    className: 'verified',
    verified: true,
  },
] as VerificationBannerItem[];
