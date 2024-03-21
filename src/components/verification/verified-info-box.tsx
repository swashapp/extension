import { CircularProgress } from '@mui/material';
import React from 'react';

import '../../static/css/components/verified-info.css';

const arrowIcon = '/static/images/shape/arrow.svg';
const errorIcon = '/static/images/shape/error.svg';

export function VerifiedInfoBox(props: {
  title: string;
  value?: string;
  loading?: boolean;
  onClick: () => void;
}): JSX.Element {
  return (
    <div
      className={
        'flex align-center justify-between border-box verified-info-box'
      }
      onClick={props.onClick}
    >
      <div>
        <p className={'small'}>{props.title}</p>
        {props.loading ? (
          <CircularProgress color={'inherit'} size={16} />
        ) : props.value ? (
          <p>{props.value}</p>
        ) : (
          <p className={'flex align-center verified-info-unverified'}>
            <img src={errorIcon} width={16} height={16} alt={'unverified'} />
            Unverified
          </p>
        )}
      </div>
      <img
        className={'verified-info-action'}
        src={arrowIcon}
        width={30}
        height={30}
        alt={'next step'}
      />
    </div>
  );
}
