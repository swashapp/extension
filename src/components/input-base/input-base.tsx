import { InputBase as MuiInputBase, InputBaseProps } from '@mui/material';
import { withStyles } from '@mui/styles';
import React from 'react';

const BootstrapInput = withStyles((theme) => ({
  root: {
    width: '100%',
    borderRadius: 100,
    backgroundColor: 'var(--color-lightest-grey)',
    border: '1px solid #E9EDEF',
    transition: theme.transitions.create(['border-color']),
    '&:focus-within': {
      borderColor: 'var(--color-grey)',
    },
  },
  input: {
    height: 30,
    position: 'relative',
    padding: '8px 16px',

    fontFamily: 'var(--font-body-name)',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 16,
  },
  disabled: {
    color: ' var(--color-black)',
  },
}))(MuiInputBase);

export function InputBase(props: InputBaseProps): JSX.Element {
  return <BootstrapInput {...props} />;
}
