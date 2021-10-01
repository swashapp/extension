import { InputProps } from '@material-ui/core';
import NumericEndAdornment from '../input/end-adronments/numeric-end-adornment';
import React, { Dispatch, SetStateAction } from 'react';

import InputBase from '../input-base/input-base';

import Label from '../label/label';

export default function NumericInput(
  props: InputProps & {
    label: string;
    setValue: Dispatch<SetStateAction<number>>;
    unit?: string;
  },
) {
  return (
    <Label id={'input-' + props.name} text={props.label}>
      <InputBase
        {...props}
        value={props.value + ' ' + props.unit}
        onChange={(e) => {
          let value: string = e.target.value;
          if (props.unit && value.indexOf(props.unit) > 0) {
            props.setValue(parseInt(value.split(' ')[0]));
          } else {
            props.setValue(parseInt(value || '0'));
          }
        }}
        className={'input'}
        id={'input-' + props.name}
        endAdornment={
          <NumericEndAdornment
            onSpinUp={() =>
              props.setValue((value: number) =>
                value < Number.MAX_SAFE_INTEGER ? value + 1 : value,
              )
            }
            onSpinDown={() =>
              props.setValue((value: number) => (value > 0 ? value - 1 : value))
            }
          />
        }
      />
    </Label>
  );
}
