import React from 'react';

const checkIcon = '/static/images/shape/check.svg';
const exclamationIcon = '/static/images/shape/exclamation.svg';

export function VerificationBadge(props: {
  verified: boolean;
  darkBackground?: boolean;
  short?: boolean;
}): JSX.Element {
  const darkBackground = props.darkBackground ? props.darkBackground : false;
  const short = props.short ? props.short : false;

  return (
    <div
      className={`profile-verification-container ${
        darkBackground
          ? props.verified
            ? 'verified-dark-background'
            : 'unverified-dark-background'
          : ''
      } ${short ? 'profile-status-short' : ''}`}
    >
      {props.verified ? (
        <div className="profile-status-verified">
          <img src={checkIcon} width={12} height={12} alt={'verified'} />
          {short ? <></> : 'Verified'}
        </div>
      ) : (
        <div className="profile-status-unverified">
          <img
            src={exclamationIcon}
            width={12}
            height={12}
            alt={'unverified'}
          />
          {short ? <></> : 'Unverified'}
        </div>
      )}
    </div>
  );
}
