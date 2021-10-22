import {
  InputBase as MuiInputBase,
  InputBaseProps,
  withStyles,
} from '@material-ui/core';
import React from 'react';

const BootstrapInput = withStyles((theme) => ({
  root: { width: '100%' },
  input: {
    borderRadius: 12,
    position: 'relative',
    backgroundColor: 'transparent',
    border: '1px solid #E9EDEF',
    padding: '38px 0px 20px 24px',
    transition: theme.transitions.create(['border-color']),

    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 14,
    '&:focus': {
      borderColor: 'var(--green)',
      borderRadius: 12,
    },
  },
  disabled: {
    color: 'var(--black)',
  },
}))(MuiInputBase);

export function InputBase(props: InputBaseProps): JSX.Element {
  return <BootstrapInput {...props} />;
}
