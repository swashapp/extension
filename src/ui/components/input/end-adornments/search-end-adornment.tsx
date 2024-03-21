import { IconButton, InputAdornment } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ReactNode } from 'react';

const searchIcon = '/static/images/shape/search.svg';

const useStyles = makeStyles(() => ({
  icon: {
    height: 'auto',
    position: 'absolute',
    right: 14,
  },
}));

export function SearchEndAdornment(): ReactNode {
  const classes = useStyles();
  return (
    <InputAdornment className={classes.icon} position={'end'}>
      <IconButton size={'large'}>
        <img src={searchIcon} alt={'search'} />
      </IconButton>
    </InputAdornment>
  );
}
