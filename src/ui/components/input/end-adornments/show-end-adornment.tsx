import { IconButton, InputAdornment } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ReactNode } from 'react';

const useStyles = makeStyles(() => ({
  icon: {
    height: 'auto',
    position: 'absolute',
    right: 14,
  },
}));

export function ShowEndAdornment({
  show,
  onClick,
}: {
  show: boolean;
  onClick: () => void;
}): ReactNode {
  const classes = useStyles();
  return (
    <InputAdornment className={classes.icon} position={'end'}>
      <IconButton size={'large'} onClick={onClick}>
        <img
          src={
            show
              ? '/static/images/shape/hide.svg'
              : '/static/images/shape/eye.svg'
          }
          alt={'copy'}
        />
      </IconButton>
    </InputAdornment>
  );
}
