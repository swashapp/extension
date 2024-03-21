import { InputProps } from "@mui/material";
import { KeyboardEvent, ReactNode } from "react";

import { Label } from "@/ui/components/label/label";

import { NumericEndAdornment } from "./end-adornments/numeric-end-adornment";
import { InputBase } from "./input-base";

export function NumericInput({
  label,
  setValue,
  unit,
  ...inputProps
}: InputProps & {
  label: string;
  setValue: (value: number) => void;
  unit?: string;
  errorMessage?: string;
}): ReactNode {
  const id = `input-${inputProps.name}`;

  return (
    <Label id={id} text={label}>
      <InputBase
        {...inputProps}
        value={`${inputProps.value} ${unit}`}
        onChange={(e) => {
          const value: string = e.target.value;
          if (unit && value.indexOf(unit) > 0)
            setValue(parseInt(value.replace(` ${unit}`, "")));
          else setValue(parseInt(value || "0"));
        }}
        onKeyDown={(
          e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
        ) => {
          if (e.key === "Backspace") {
            e.preventDefault();
            const value = (inputProps.value as number).toString();
            console.log("Backspace", value);
            const currentStr =
              unit && value.indexOf(unit) > 0
                ? value.replace(` ${unit}`, "")
                : value;
            const newStr = currentStr.slice(0, -1);
            const newVal = newStr === "" ? 0 : parseInt(newStr, 10);
            setValue(newVal);
          }
        }}
        className={"input"}
        id={id}
        endAdornment={
          <>
            {inputProps.endAdornment}
            <NumericEndAdornment
              onSpinUp={() => {
                const _value = inputProps.value as number;
                setValue(
                  _value < Number.MAX_SAFE_INTEGER ? _value + 1 : _value,
                );
              }}
              onSpinDown={() => {
                const _value = inputProps.value as number;
                setValue(_value > 0 ? _value - 1 : _value);
              }}
            />
          </>
        }
      />
    </Label>
  );
}
