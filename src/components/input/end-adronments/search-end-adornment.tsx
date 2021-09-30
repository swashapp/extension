import React from 'react';
import { IconButton, InputAdornment, makeStyles } from '@material-ui/core';

import searchIcon from 'url:../../../static/images/shape/search.svg';

const useStyles = makeStyles(() => ({
  icon: {
    top: '50%',
    right: 14,
    position: 'absolute',
  },
}));

export default function SearchEndAdornment(props: { value: string }) {
  const classes = useStyles();
  return (
    <InputAdornment className={classes.icon} position="end">
      <IconButton>
        <img src={searchIcon} alt={'search'} />
      </IconButton>
    </InputAdornment>
  );
}
