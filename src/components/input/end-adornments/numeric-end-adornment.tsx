import { InputAdornment, makeStyles } from '@material-ui/core';

import React from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import innerSpin from 'url:../../../static/images/shape/inner-spin.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import outerSpin from 'url:../../../static/images/shape/outer-spin.svg';

const useStyles = makeStyles(() => ({
  icon: {
    top: '40%',
    right: 30,
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    margin: 0,
  },
  button: {
    display: 'flex',
    cursor: 'pointer',
    width: 12,
    height: 8,
    padding: 0,
    margin: 0,
  },
}));

export function NumericEndAdornment(props: {
  onSpinUp: () => void;
  onSpinDown: () => void;
}): JSX.Element {
  const classes = useStyles();
  return (
    <InputAdornment className={classes.icon} position="end">
      <div
        className={classes.button}
        style={{ marginBottom: 6 }}
        onClick={props.onSpinUp}
      >
        <img width={12} height={8} src={outerSpin} alt={'+'} />
      </div>
      <div className={classes.button} onClick={props.onSpinDown}>
        <img width={12} height={8} src={innerSpin} alt={'-'} />
      </div>
    </InputAdornment>
  );
}
