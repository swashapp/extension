import { CircularProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
  },
  bottom: {
    color: 'var(--gray)',
    position: 'absolute',
    left: 'calc(50% - 25px)',
  },
  top: {
    color: 'var(--blue)',
    animationDuration: '550ms',
    position: 'absolute',
    left: 'calc(50% - 25px)',
  },
  circle: {
    strokeLinecap: 'round',
  },
}));

export function WaitingProgressBar(): JSX.Element {
  const classes = useStyles();
  return (
    <div className="waiting-progress">
      <CircularProgress
        variant="determinate"
        className={classes.bottom}
        size={50}
        thickness={4}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
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
