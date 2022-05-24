import { InputProps } from '@mui/material';
import React from 'react';

import { InputBase } from '../input-base/input-base';
import { Label } from '../label/label';

export function Input(props: InputProps & { label?: string }): JSX.Element {
  return (
    <Label
      id={'input-' + props.name}
      shrink={!!props.placeholder || undefined}
      text={props.label || ''}
    >
      <InputBase
        className={`input ${props.className}`}
        id={'input-' + props.name}
        inputProps={{
          className: props.endAdornment ? 'input-ellipsis' : '',
          style: props.label ? {} : { paddingTop: 32, paddingBottom: 32 },
        }}
        {...props}
      />
    </Label>
  );
}
