import { InputBase as MuiInputBase, InputBaseProps } from '@mui/material';
import { withStyles } from '@mui/styles';
import React, { ReactElement } from 'react';

const BootstrapInput = withStyles((theme) => ({
  root: {
    width: '100%',
    borderRadius: 100,
    backgroundColor: 'var(--color-lightest-grey)',
    transition: theme.transitions.create(['border-color']),
    '&:focus-within': {
      borderColor: 'var(--color-grey)',
    },
  },
  input: {
    height: 30,
    position: 'relative',
    padding: '8px 16px',

    fontSize: 16,
    fontFamily: 'var(--font-body-name)',
    fontStyle: 'normal',
  },
  disabled: {
    color: ' var(--color-black)',
  },
}))(MuiInputBase);

export function InputBase(props: InputBaseProps): ReactElement {
  return <BootstrapInput {...props} />;
}
