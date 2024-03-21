import React, { ReactElement } from 'react';

import '../../static/css/components/verification-badge.css';

const checkIcon = '/static/images/shape/check.svg';
const exclamationIcon = '/static/images/shape/exclamation.svg';

export function VerificationBadge(props: {
  verified?: boolean;
  darkBackground?: boolean;
  short?: boolean;
}): ReactElement {
  const darkBackground = props.darkBackground ? props.darkBackground : false;
  const short = props.short ? props.short : false;

  if (props.verified === undefined) return <></>;

  return (
    <div
      className={`flex center verification-badge-container ${
        props.verified ? 'verified' : 'unverified'
      } ${darkBackground ? 'dark' : ''} ${short ? 'short' : ''}`}
    >
      {props.verified ? (
        <>
          <img src={checkIcon} width={12} height={12} alt={'verified'} />
          {short ? <></> : <p className={'small'}>Verified</p>}
        </>
      ) : (
        <>
          <img
            src={exclamationIcon}
            width={12}
            height={12}
            alt={'unverified'}
          />
          {short ? <></> : <p className={'small'}>Unverified</p>}
        </>
      )}
    </div>
  );
}
