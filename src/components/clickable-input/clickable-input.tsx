import { CircularProgress } from '@mui/material';
import { ReactElement } from 'react';

import '../../static/css/components/clickable-input.css';

const arrowIcon = '/static/images/shape/small-arrow.svg';

export function ClickableInput(props: {
  label: string;
  placeholder: ReactElement;
  value?: string;
  loading?: boolean;
  onClick: () => void;
}): ReactElement {
  return (
    <div className={'flex col gap4 border-box clickable-input'}>
      <p className={'bold'}>{props.label}</p>
      <div
        className={
          'flex nowrap justify-between align-center clickable-input-input'
        }
        onClick={props.onClick}
      >
        {props.loading ? (
          <CircularProgress color={'inherit'} size={16} />
        ) : (
          <>
            {props.value ? (
              <p>{props.value}</p>
            ) : (
              <p className={'flex align-center gap4'}>{props.placeholder}</p>
            )}
            <img
              className={'clickable-input-action'}
              src={arrowIcon}
              width={16}
              height={8}
              alt={'next'}
            />
          </>
        )}
      </div>
    </div>
  );
}
