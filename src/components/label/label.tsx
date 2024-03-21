import { FormControl } from '@mui/material';
import React, { ReactElement } from 'react';
import { PropsWithChildren } from 'react';

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
      {props.text}
      {props.children}
    </FormControl>
  );
}
