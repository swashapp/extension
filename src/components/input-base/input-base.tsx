import { InputBase as MuiInputBase, InputBaseProps } from '@mui/material';
import { withStyles } from '@mui/styles';
import React from 'react';

const BootstrapInput = withStyles((theme) => ({
  root: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: 'transparent',
    border: '1px solid #E9EDEF',
    transition: theme.transitions.create(['border-color']),
    '&:focus-within': {
      borderColor: 'var(--green)',
      borderRadius: 12,
    },
  },
  input: {
    position: 'relative',
    padding: '32px 0 20px 24px',

    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 14,
  },
  disabled: {
    color: 'var(--black)',
  },
}))(MuiInputBase);

export function InputBase(props: InputBaseProps): JSX.Element {
  return <BootstrapInput {...props} />;
}
