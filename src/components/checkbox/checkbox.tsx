import { Checkbox as MuiCheckbox } from '@mui/material';
import { makeStyles } from '@mui/styles';
import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';

const useStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    borderRadius: 4,
    width: 20,
    height: 20,
    border: '1px solid #E9EDEF',
    boxSizing: 'border-box',
    backgroundColor: 'var(--white)',
    '$root.Mui-focusVisible &': {
      outline: '2px auto black',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: 'var(--lightest-green)',
    },
  },
  checkedIcon: {
    backgroundColor: 'var(--green)',
    width: 20,
    height: 20,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='10' height='8' viewBox='0 0 10 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath" +
      " d='M9.39997 1.99998L7.99998 0.599976L3.99998 4.59998L1.99998 2.59998L0.599976 3.99998L3.99998 7.39998L9.39997 1.99998Z'" +
      " fill='black'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    'input:hover ~ &': {
      backgroundColor: 'var(--dark-green)',
    },
  },
});
export function Checkbox(
  props: PropsWithChildren<{
    checked: boolean;
    onChange?: (event: React.ChangeEvent) => void;
  }>,
): JSX.Element {
  const classes = useStyles();

  return (
    <MuiCheckbox
      className={classes.root}
      disableRipple
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      inputProps={{ 'aria-label': 'decorative checkbox' }}
      {...props}
    />
  );
}
