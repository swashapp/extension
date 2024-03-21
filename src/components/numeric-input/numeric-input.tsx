import { InputProps } from '@mui/material';
import { Dispatch, ReactElement, SetStateAction, useMemo } from 'react';

import { NumericEndAdornment } from '../input/end-adornments/numeric-end-adornment';
import { InputBase } from '../input-base/input-base';
import { Label } from '../label/label';

export function NumericInput(
  props: InputProps & {
    label: string;
    setValue: Dispatch<SetStateAction<number>>;
    unit?: string;
  },
): ReactElement {
  const inputProps: InputProps = useMemo(() => {
    const ret: InputProps & {
      label?: string;
      setValue?: Dispatch<SetStateAction<number>>;
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
