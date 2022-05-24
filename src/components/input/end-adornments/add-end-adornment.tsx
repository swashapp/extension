import { InputAdornment } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';

import { Button } from '../../button/button';

const useStyles = makeStyles(() => ({
  icon: {
    top: '50%',
    right: 17,
    position: 'absolute',
  },
}));

export function AddEndAdornment(props: {
  onAdd: () => void;
  disabled?: boolean;
}): JSX.Element {
  const classes = useStyles();
  return (
    <InputAdornment
      onClick={props.onAdd}
      className={classes.icon}
      position="end"
    >
      <Button
        link={false}
        text="Add"
        color="secondary"
        disabled={props.disabled}
      />
    </InputAdornment>
  );
}
