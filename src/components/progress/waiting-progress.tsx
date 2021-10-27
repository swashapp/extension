import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
  },
  bottom: {
    color: 'var(--gray)',
    position: 'absolute',
    left: '50%',
  },
  top: {
    color: 'var(--blue)',
    animationDuration: '550ms',
    position: 'absolute',
    left: '50%',
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
