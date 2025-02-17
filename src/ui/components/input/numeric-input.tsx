import { InputProps } from "@mui/material";
import { KeyboardEvent, ReactNode, useCallback } from "react";

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
  const stepValue = inputProps.inputProps?.step
    ? parseFloat(inputProps.inputProps.step.toString())
    : 1;

  const truncateTo4Decimals = (num: number): number =>
    parseFloat(num.toFixed(4));

  const formatNumber = (num: number): string =>
    parseFloat(num.toFixed(4)).toString();

  const parseValue = (val: string): number => {
    const numericString = unit
      ? val.replace(` ${unit}`, "").trim()
      : val.trim();
    const parsed = parseFloat(numericString);
    return isNaN(parsed) ? 0 : parsed;
  };

  const increase = useCallback(() => {
    const _value = parseFloat(inputProps.value as string);
    const newValue =
      _value < Number.MAX_SAFE_INTEGER ? _value + stepValue : _value;
    setValue(truncateTo4Decimals(newValue));
  }, [inputProps.value, setValue, stepValue]);

  const decrease = useCallback(() => {
    const _value = parseFloat(inputProps.value as string);
    const newValue = _value > 0 ? Math.max(0, _value - stepValue) : _value;
    setValue(truncateTo4Decimals(newValue));
  }, [inputProps.value, setValue, stepValue]);

  return (
    <Label id={id} text={label}>
      <InputBase
        {...inputProps}
        value={`${formatNumber(parseFloat(inputProps.value as string))}${
          unit ? ` ${unit}` : ""
        }`}
        onChange={(e) => {
          const valueStr: string = e.target.value;
          const numericValue = parseValue(valueStr);
          setValue(truncateTo4Decimals(numericValue));
        }}
        onKeyDown={(
          e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
        ) => {
          if (e.key === "Backspace") {
            e.preventDefault();
            const valueStr = (inputProps.value as number).toString();
            const currentStr =
              unit && valueStr.indexOf(unit) > 0
                ? valueStr.replace(` ${unit}`, "")
                : valueStr;
            const newStr = currentStr.slice(0, -1);
            const newVal = newStr === "" ? 0 : parseFloat(newStr);
            setValue(truncateTo4Decimals(newVal));
          } else if (e.key === "ArrowUp") increase();
          else if (e.key === "ArrowDown") decrease();
        }}
        className={"input"}
        id={id}
        endAdornment={
          <>
            {inputProps.endAdornment}
            <NumericEndAdornment onSpinUp={increase} onSpinDown={decrease} />
          </>
        }
      />
    </Label>
  );
}
