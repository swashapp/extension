import { InputProps } from '@mui/material';
import { ReactNode, useMemo } from 'react';

import { Label } from '../label/label';

import { NumericEndAdornment } from './end-adornments/numeric-end-adornment';
import { InputBase } from './input-base';

export function NumericInput(
  props: InputProps & {
    label: string;
    setValue: (value: number) => void;
    unit?: string;
  },
): ReactNode {
  const inputProps: InputProps = useMemo(() => {
    const ret: InputProps & {
      label?: string;
      setValue?: (value: number) => void;
      unit?: string;
    } = { ...props };
    delete ret.setValue;
    delete ret.unit;
    delete ret.label;
    return ret;
  }, [props]);
  return (
    <Label id={'input-' + props.name} text={props.label}>
      <InputBase
        {...inputProps}
        value={props.value + ' ' + props.unit}
        onChange={(e) => {
          const value: string = e.target.value;
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
            onSpinUp={() => {
              const _value = props.value as number;
              props.setValue(
                _value < Number.MAX_SAFE_INTEGER ? _value + 1 : _value,
              );
            }}
            onSpinDown={() => {
              const _value = props.value as number;
              props.setValue(_value > 0 ? _value - 1 : _value);
            }}
          />
        }
      />
    </Label>
  );
}
