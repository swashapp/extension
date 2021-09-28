import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import MuiCheckbox from '@material-ui/core/Checkbox';

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
    backgroundColor: '#FFFFFF',
    '$root.Mui-focusVisible &': {
      outline: '2px auto black',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#c5ffd9',
    },
  },
  checkedIcon: {
    backgroundColor: '#3CE35F',
    width: 20,
    height: 20,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='10' height='8' viewBox='0 0 10 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath" +
      " d='M9.39997 1.99998L7.99998 0.599976L3.99998 4.59998L1.99998 2.59998L0.599976 3.99998L3.99998 7.39998L9.39997 1.99998Z'" +
      " fill='black'/%3E%3C/svg%3E\")",
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    'input:hover ~ &': {
      backgroundColor: '#26bc57',
    },
  },
});
export default function Checkbox(
  props: PropsWithChildren<{
    value: boolean;
    onChange?: (event: any) => void;
  }>,
) {
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