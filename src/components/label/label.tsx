import { FormControl, InputLabel, withStyles } from '@material-ui/core';
import React from 'react';
import { PropsWithChildren } from 'react';

const Label = withStyles(() => ({
  root: {
    zIndex: 1,
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

export default function Select(
  props: PropsWithChildren<{
    id: string;
    text: string;
  }>,
) {
  return (
    <FormControl style={{ width: '100%' }}>
      <Label htmlFor={props.id}>{props.text}</Label>
      {props.children}
    </FormControl>
  );
}
