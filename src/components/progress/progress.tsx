import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const MuiLinearProgress = withStyles((theme) => ({
  root: {
    height: 3,
    borderRadius: 12,
  },
  colorPrimary: {
    backgroundColor: 'var(--white)',
  },
  bar: {
    borderRadius: 12,
    backgroundColor: 'var(--blue)',
  },
}))(LinearProgress);

export default function ProgressBar(props: { value: number }) {
  return <MuiLinearProgress variant="determinate" value={props.value} />;
}
