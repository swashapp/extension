import { FormControl, InputLabel, withStyles } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { PropsWithChildren } from 'react';

const MuiLabel = withStyles(() => ({
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

export function Label(
  props: PropsWithChildren<{
    id: string;
    children: ReactElement;
    text: string;
    shrink?: boolean | undefined;
  }>,
): JSX.Element {
  return (
    <FormControl style={{ width: '100%' }}>
      <MuiLabel htmlFor={props.id} shrink={props.shrink}>
        {props.text}
      </MuiLabel>
      {props.children}
    </FormControl>
  );
}
