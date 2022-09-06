import { CircularProgress } from '@mui/material';
import React from 'react';

const arrowIcon = '/static/images/shape/arrow.svg';
const errorIcon = '/static/images/shape/error.svg';

export function VerifiedInfoBox(props: {
  title: string;
  value?: string;
  loading?: boolean;
  onClick: () => void;
}): JSX.Element {
  return (
    <div className="verified-info-box" onClick={props.onClick}>
      <div>
        <div className="verified-info-title">{props.title}</div>
        {props.loading ? (
          <CircularProgress color={'inherit'} size={16} />
        ) : props.value ? (
          <div className="verified-info-value">{props.value}</div>
        ) : (
          <div className="verified-info-unverified">
            <img src={errorIcon} width={16} height={16} alt={'unverified'} />
            Unverified
          </div>
        )}
      </div>
      <div className="verified-info-action">
        <img src={arrowIcon} width={30} height={30} alt={'next step'} />
      </div>
    </div>
  );
}
