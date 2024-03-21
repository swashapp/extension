import { InputBase as MuiInputBase, InputBaseProps } from "@mui/material";
import { withStyles } from "@mui/styles";
import { ReactNode } from "react";

const BootstrapInput = withStyles((theme) => ({
  root: {
    width: "100%",
    borderRadius: 100,
    backgroundColor: "var(--color-lightest-grey)",
    transition: theme.transitions.create(["border-color"]),
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
  },
}))(MuiInputBase);

export function InputBase(props: InputBaseProps): ReactNode {
  return (
    <div className={"flex col gap8"}>
      <BootstrapInput {...props} />
      {props.error ? (
        <p className={"smaller"} style={{ color: "var(--color-red)" }}>
          <span className={"smaller"} style={{ textTransform: "capitalize" }}>
            {props.name}
          </span>{" "}
          is invalid
        </p>
      ) : null}
    </div>
  );
}
