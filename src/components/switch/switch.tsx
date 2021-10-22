import { withStyles } from '@material-ui/core/styles';
import MuiSwitch, { SwitchProps } from '@material-ui/core/Switch';
import React from 'react';

const StyledSwitch = withStyles((theme) => ({
  root: {
    width: 32,
    height: 20,
    padding: 0,
  },
  switchBase: {
    padding: 1,
    '&$checked': {
      transform: 'translateX(16px)',
      color: 'var(--white)',
      '& + $track': {
        backgroundColor: 'var(--gray)',
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: 'var(--gray)',
      border: '6px solid #fff',
    },
  },
  thumb: {
    width: 16,
    height: 16,
  },
  track: {
    borderRadius: 9,
    backgroundColor: 'var(--light-green)',
    opacity: 1,
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(MuiSwitch);

export function Switch(props: SwitchProps): JSX.Element {
  return <StyledSwitch {...props} />;
}
