import {
  FormControl,
  InputBase,
  InputLabel,
  makeStyles,
  withStyles,
} from '@material-ui/core';
import MuiSelect from '@material-ui/core/Select';
import React from 'react';
import { PropsWithChildren } from 'react';
import smallArrow from 'url:../../static/images/shape/small-arrow.svg';

const Label = withStyles(() => ({
  root: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWight: 500,
    fontSize: 12,
    color: '#8091A3 !important',
    top: 10,
    left: 24,
  },
  focused: {
    color: '#8091A3 !important',
  },
  shrink: {
    fontWight: 500,
    fontSize: 16,
    top: 20,
  },
}))(InputLabel);

const BootstrapInput = withStyles((theme) => ({
  root: {},
  input: {
    borderRadius: 12,
    position: 'relative',
    backgroundColor: 'transparent',
    border: '1px solid #E9EDEF',
    padding: '38px 0px 20px 24px',
    transition: theme.transitions.create(['border-color']),

    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 14,
    '&:focus': {
      borderColor: 'var(--green)',
      borderRadius: 12,
    },
  },
}))(InputBase);

const useStyles = makeStyles(() => ({
  icon: {
    top: '50%',
    color: 'rgba(0, 0, 0, 0.54)',
    right: 26,
    position: 'absolute',
    pointerEvents: 'none',
  },
}));

export default function Select(
  props: PropsWithChildren<{
    label: string;
    value: string | number;
    onChange?: (event: any) => void;
  }>,
) {
  const classes = useStyles();
  return (
    <FormControl>
      <Label htmlFor="customized-select">{props.label}</Label>
      <MuiSelect
        displayEmpty={true}
        IconComponent={() => (
          <img className={classes.icon} src={smallArrow} alt={'>'} />
        )}
        className={'select'}
        id="customized-select"
        value={props.value}
        onChange={props.onChange}
        input={<BootstrapInput />}
      >
        {props.children}
      </MuiSelect>
    </FormControl>
  );
}
