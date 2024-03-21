import { InputAdornment } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ReactNode } from 'react';

import { ButtonColors } from '../../../../enums/button.enum';
import { Button } from '../../button/button';

const useStyles = makeStyles(() => ({
  icon: {
    height: 'auto',
    position: 'absolute',
    right: 14,
  },
}));

export function TextEndAdornment({
  text,
  onClick,
  disabled,
}: {
  text: string;
  onClick: () => void;
  disabled?: boolean;
}): ReactNode {
  const classes = useStyles();
  return (
    <InputAdornment
      onClick={onClick}
      className={`no-overflow ${classes.icon}`}
      position={'end'}
    >
      <Button
        text={text}
        color={ButtonColors.TRANSPARENT}
        disabled={disabled}
      />
    </InputAdornment>
  );
}
