import React from 'react';
import { InputAdornment, makeStyles } from '@material-ui/core';

import Button from '../../button/button';

const useStyles = makeStyles(() => ({
  icon: {
    top: '50%',
    right: 17,
    position: 'absolute',
  },
}));

export default function AddEndAdornment(props: { onAdd: () => void }) {
  const classes = useStyles();
  return (
    <InputAdornment
      onClick={props.onAdd}
      className={classes.icon}
      position="end"
    >
      <Button link={false} text="Add" color="secondary" />
    </InputAdornment>
  );
}
