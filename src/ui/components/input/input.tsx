import { InputProps } from '@mui/material';
import { ReactNode } from 'react';

import { Label } from '../label/label';

import { InputBase } from './input-base';

export function Input(props: InputProps & { label?: string }): ReactNode {
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
