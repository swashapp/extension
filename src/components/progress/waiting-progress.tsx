import { CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { ReactElement } from 'react';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
  },
  bottom: {
    color: 'var(--color-grey)',
    position: 'absolute',
    left: 'calc(50% - 25px)',
  },
  top: {
    color: 'var(--color-purple)',
    animationDuration: '550ms',
    position: 'absolute',
    left: 'calc(50% - 25px)',
  },
  circle: {
    strokeLinecap: 'round',
  },
}));

export function WaitingProgressBar(): ReactElement {
  const classes = useStyles();
  return (
    <div className={'round flex col text-center onboarding-block'}>
      <CircularProgress
        variant={'determinate'}
        className={classes.bottom}
        size={50}
        thickness={4}
        value={100}
      />
      <CircularProgress
        variant={'indeterminate'}
        disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={50}
        thickness={4}
      />
      <p>Waiting...</p>
    </div>
  );
}
