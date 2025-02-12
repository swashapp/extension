import { InputBase as MuiInputBase, InputBaseProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";

import { useTheme } from "@/ui/context/theme.context";

const LightInput = styled(MuiInputBase)(() => ({
  width: "100%",
  borderRadius: 100,
  backgroundColor: "var(--color-lightest-grey)",
  transition: "border-color 0.3s ease",
  "&:focus-within": {
    borderColor: "var(--color-grey)",
  },
  "& .MuiInputBase-input": {
    height: 30,
    position: "relative",
    padding: "8px 16px",
    fontSize: 16,
    fontFamily: "var(--font-body-name)",
    fontStyle: "normal",
  },
  "& .MuiInputBase-input:disabled": {
    color: "var(--color-black)",
    WebkitTextFillColor: "var(--color-black) !important",
  },
}));

const DarkInput = styled(MuiInputBase)(() => ({
  width: "100%",
  borderRadius: 100,
  color: "var(--color-light-grey)",
  backgroundColor: "var(--color-jet-black)",
  transition: "border-color 0.3s ease",
  "&:focus-within": {
    borderColor: "var(--color-jet-black)",
  },
  "& .MuiInputBase-input": {
    height: 30,
    position: "relative",
    padding: "8px 16px",
    fontSize: 16,
    fontFamily: "var(--font-body-name)",
    fontStyle: "normal",
  },
  "& .MuiInputBase-input:disabled": {
    color: "var(--color-light-grey)",
    WebkitTextFillColor: "var(--color-light-grey) !important",
  },
}));

export function InputBase(
  props: InputBaseProps & { errorMessage?: string },
): ReactNode {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex col gap8">
      {isDark ? <DarkInput {...props} /> : <LightInput {...props} />}
      {props.error ? (
        <p className="smaller" style={{ color: "var(--color-red)" }}>
          {props.errorMessage ?? (
            <>
              <span className="smaller" style={{ textTransform: "capitalize" }}>
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
