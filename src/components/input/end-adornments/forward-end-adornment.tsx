import { IconButton, InputAdornment } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';

const arrowIcon = '/static/images/shape/arrow.svg';

const useStyles = makeStyles(() => ({
  icon: {
    top: '50%',
    right: 14,
    position: 'absolute',
  },
}));

export function ForwardEndAdornment(props: {
  onClick: () => void;
}): JSX.Element {
  const classes = useStyles();
  return (
    <InputAdornment className={classes.icon} position="end">
      <IconButton size="large" onClick={props.onClick}>
        <img src={arrowIcon} alt={'next step'} />
      </IconButton>
    </InputAdornment>
  );
}
