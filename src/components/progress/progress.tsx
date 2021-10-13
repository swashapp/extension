import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import React, { memo } from 'react';

const MuiLinearProgress = withStyles(() => ({
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

export default memo(function ProgressBar(props: { value: number }) {
  return <MuiLinearProgress variant="determinate" value={props.value} />;
});
