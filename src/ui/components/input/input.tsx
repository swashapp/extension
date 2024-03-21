import { InputProps } from "@mui/material";
import clsx from "clsx";
import { ReactNode } from "react";

import { Label } from "@/ui/components/label/label";

import { InputBase } from "./input-base";

export function Input(
  props: InputProps & { label?: string; errorMessage?: string },
): ReactNode {
  const id = `input-${props.name}`;
  return (
    <Label
      id={id}
      shrink={!!props.placeholder || undefined}
      text={props.label || ""}
    >
      <InputBase
        className={clsx("input", props.className)}
        id={id}
        inputProps={{
          className: clsx({ "input-ellipsis": props.endAdornment }),
          style: props.label ? {} : { paddingTop: 32, paddingBottom: 32 },
        }}
        {...props}
      />
    </Label>
  );
}
