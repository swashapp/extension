import { styled, Switch as MuiSwitch, SwitchProps } from "@mui/material";
import { ReactNode } from "react";

const CustomSwitch = styled((props: SwitchProps) => {
  return (
    <MuiSwitch
      focusVisibleClassName={".Mui-focusVisible"}
      disableRipple
      {...props}
    />
  );
})(() => ({
  width: 32,
  height: 20,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 16,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: " var(--color-white)",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "var(--color-dark-purple)",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 16,
    height: 16,
    borderRadius: 9,
    transition: "width 200ms",
  },
  "& .MuiSwitch-track": {
    borderRadius: 12,
    opacity: 1,
    backgroundColor: "var(--color-grey)",
    boxSizing: "border-box",
  },
}));

export function Switch(props: SwitchProps): ReactNode {
  return <CustomSwitch {...props} />;
}
