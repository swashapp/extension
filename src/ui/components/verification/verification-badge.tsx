import { ReactNode } from 'react';

import '../../../static/css/components/verification-badge.css';

export function VerificationBadge(props: {
  verified?: boolean;
  darkBackground?: boolean;
  short?: boolean;
}): ReactNode {
  const darkBackground = props.darkBackground ? props.darkBackground : false;
  const short = props.short ? props.short : false;

  if (props.verified === undefined) return null;

  return (
    <div
      className={`flex center verification-badge-container ${
        props.verified ? 'verified' : 'unverified'
      } ${darkBackground ? 'dark' : ''} ${short ? 'short' : ''}`}
    >
      {props.verified ? (
        <>
          <img
            src={'/static/images/shape/check.svg'}
            width={12}
            height={12}
            alt={'verified'}
          />
          {short ? null : <p className={'small'}>Verified</p>}
        </>
      ) : (
        <>
          <img
            src={'/static/images/shape/exclamation.svg'}
            width={12}
            height={12}
            alt={'unverified'}
          />
          {short ? null : <p className={'small'}>Unverified</p>}
        </>
      )}
    </div>
  );
}
