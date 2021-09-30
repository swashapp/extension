import { InputProps } from '@material-ui/core';
import React from 'react';

import InputBase from '../input-base/input-base';

import Label from '../label/label';

export default function Input(props: InputProps & { label?: string }) {
  return (
    <Label id={'input-' + props.name} text={props.label || ''}>
      <InputBase
        className={'input'}
        id={'input-' + props.name}
        inputProps={{
          style: props.label ? {} : { paddingTop: 20 },
        }}
        {...props}
      />
    </Label>
  );
}
