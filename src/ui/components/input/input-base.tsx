import { InputBase as MuiInputBase, InputBaseProps } from "@mui/material";
import { withStyles } from "@mui/styles";
import { ReactNode } from "react";

import { useTheme } from "@/ui/context/theme.context";

const LightInput = withStyles(() => ({
  root: {
    width: "100%",
    borderRadius: 100,
    backgroundColor: "var(--color-lightest-grey)",
    transition: "border-color 0.3s ease",
    "&:focus-within": {
      borderColor: "var(--color-grey)",
    },
  },
  input: {
    height: 30,
    position: "relative",
    padding: "8px 16px",

    fontSize: 16,
    fontFamily: "var(--font-body-name)",
    fontStyle: "normal",
  },
  disabled: {
    color: "var(--color-black)",
    "-webkit-text-fill-color": "var(--color-black) !important",
  },
}))(MuiInputBase);

const DarkInput = withStyles(() => ({
  root: {
    width: "100%",
    borderRadius: 100,
    color: "var(--color-light-grey)",
    backgroundColor: "var(--color-jet-black)",
    transition: "border-color 0.3s ease",
    "&:focus-within": {
      borderColor: "var(--color-jet-black)",
    },
  },
  input: {
    height: 30,
    position: "relative",
    padding: "8px 16px",

    fontSize: 16,
    fontFamily: "var(--font-body-name)",
    fontStyle: "normal",
  },
  disabled: {
    color: "var(--color-light-grey)",
    "-webkit-text-fill-color": "var(--color-light-grey) !important",
  },
}))(MuiInputBase);

export function InputBase(
  props: InputBaseProps & { errorMessage?: string },
): ReactNode {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={"flex col gap8"}>
      {isDark ? <DarkInput {...props} /> : <LightInput {...props} />}
      {props.error ? (
        <p className={"smaller"} style={{ color: "var(--color-red)" }}>
          {props.errorMessage ?? (
            <>
              <span
                className={"smaller"}
                style={{ textTransform: "capitalize" }}
              >
                {props.name}
              </span>{" "}
              is invalid
            </>
          )}
        </p>
      ) : null}
    </div>
  );
}
