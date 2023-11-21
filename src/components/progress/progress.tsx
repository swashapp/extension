import { LinearProgress } from '@mui/material';
import { withStyles } from '@mui/styles';
import React from 'react';

const MuiLinearProgress = withStyles(() => ({
  root: {
    height: 3,
    borderRadius: 12,
  },
  colorPrimary: {
    backgroundColor: ' var(--color-white)',
  },
  bar: {
    borderRadius: 12,
    backgroundColor: 'var(--color-purple)',
  },
}))(LinearProgress);

export function ProgressBar(props: { value: number }): JSX.Element {
  return <MuiLinearProgress variant="determinate" value={props.value} />;
}
