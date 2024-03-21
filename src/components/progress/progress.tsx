import { LinearProgress } from '@mui/material';
import { withStyles } from '@mui/styles';
import React, { ReactElement } from 'react';

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
    backgroundColor: 'var(--color-green)',
  },
}))(LinearProgress);

export function ProgressBar(props: { value: number }): ReactElement {
  return <MuiLinearProgress variant="determinate" value={props.value} />;
}
