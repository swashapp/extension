import { InputProps } from '@material-ui/core';
import React from 'react';

import InputBase from '../input-base/input-base';

import Label from '../label/label';

export default function Input(props: InputProps & { label?: string }) {
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
          style: props.label
            ? {}
            : props.placeholder
            ? { paddingTop: 32, paddingBottom: 32 }
            : { paddingTop: 20 },
        }}
        {...props}
      />
    </Label>
  );
}
