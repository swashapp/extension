import { IconButton, InputAdornment, makeStyles } from '@material-ui/core';
import React from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import searchIcon from 'url:../../../static/images/shape/search.svg';

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
      <IconButton>
        <img src={searchIcon} alt={'search'} />
      </IconButton>
    </InputAdornment>
  );
}
