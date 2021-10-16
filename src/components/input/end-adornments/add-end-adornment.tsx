import { InputAdornment, makeStyles } from '@material-ui/core';
import React, { memo } from 'react';

import Button from '../../button/button';

const useStyles = makeStyles(() => ({
  icon: {
    top: '50%',
    right: 17,
    position: 'absolute',
  },
}));

export default memo(function AddEndAdornment(props: {
  onAdd: () => void;
  disabled?: boolean;
}) {
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
});
