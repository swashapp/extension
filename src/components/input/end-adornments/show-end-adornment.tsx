import { IconButton, InputAdornment } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { ReactElement } from 'react';

const eyeIcon = '/static/images/shape/eye.svg';
const hideIcon = '/static/images/shape/hide.svg';

const useStyles = makeStyles(() => ({
  icon: {
    top: '50%',
    right: 14,
    position: 'absolute',
  },
}));

export function ShowEndAdornment(props: {
  show: boolean;
  onClick: () => void;
}): ReactElement {
  const classes = useStyles();
  return (
    <InputAdornment className={classes.icon} position={'end'}>
      <IconButton size={'large'} onClick={props.onClick}>
        <img src={props.show ? hideIcon : eyeIcon} alt={'copy'} />
      </IconButton>
    </InputAdornment>
  );
}
