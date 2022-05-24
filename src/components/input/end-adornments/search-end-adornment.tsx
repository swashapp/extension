import { IconButton, InputAdornment } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';

const searchIcon = '/static/images/shape/search.svg';

const useStyles = makeStyles(() => ({
  icon: {
    top: '50%',
    right: 14,
    position: 'absolute',
  },
}));

export function SearchEndAdornment(): JSX.Element {
  const classes = useStyles();
  return (
    <InputAdornment className={classes.icon} position="end">
      <IconButton size="large">
        <img src={searchIcon} alt={'search'} />
      </IconButton>
    </InputAdornment>
  );
}
