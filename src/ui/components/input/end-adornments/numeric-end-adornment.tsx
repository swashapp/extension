import { InputAdornment } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ReactNode } from 'react';

const innerSpin = '/static/images/shape/inner-spin.svg';
const outerSpin = '/static/images/shape/outer-spin.svg';

const useStyles = makeStyles(() => ({
  icon: {
    height: 'auto',
    position: 'absolute',
    right: 14,
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

export function NumericEndAdornment({
  onSpinUp,
  onSpinDown,
}: {
  onSpinUp: () => void;
  onSpinDown: () => void;
}): ReactNode {
  const classes = useStyles();
  return (
    <InputAdornment className={classes.icon} position={'end'}>
      <div
        className={classes.button}
        style={{ marginBottom: 6 }}
        onClick={onSpinUp}
      >
        <img width={12} height={8} src={outerSpin} alt={'+'} />
      </div>
      <div className={classes.button} onClick={onSpinDown}>
        <img width={12} height={8} src={innerSpin} alt={'-'} />
      </div>
    </InputAdornment>
  );
}
