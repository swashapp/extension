import { useEffect, useRef } from "react";
import MuiPhoneInput, { PhoneInputProps } from "react-phone-input-2";

import { Label } from "../label/label";

import "react-phone-input-2/lib/material.css";
import "./react-tel-input.css";

export function PhoneInput(props: PhoneInputProps & { label?: string }) {
  const id = `input-${props.label}`;

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <Label
      id={id}
      shrink={!!props.placeholder || undefined}
      text={props.label || ""}
    >
      <MuiPhoneInput
        enableSearch
        defaultMask="(...)-...-...."
        enableLongNumbers={12}
        inputProps={{ maxLength: 20, ref }}
        dropdownStyle={{ zIndex: 1000 }}
        {...props}
      />
    </Label>
  );
}
