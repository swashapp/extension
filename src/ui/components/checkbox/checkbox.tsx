import { Checkbox as MuiCheckbox } from "@mui/material";
import { makeStyles } from "@mui/styles";
import clsx from "clsx";
import { ChangeEvent, ReactNode } from "react";

const useStyles = makeStyles({
  root: {
    padding: 0,
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  icon: {
    borderRadius: 4,
    width: 20,
    height: 20,
    border: "1px solid var(--color-grey)",
    boxSizing: "border-box",
    backgroundColor: " var(--color-white)",
    "$root.Mui-focusVisible &": {
      outline: "2px auto black",
      outlineOffset: 2,
    },
    "input:hover ~ &": {
      backgroundColor: "var(--color-lightest-grey)",
    },
  },
  checkedIcon: {
    width: 20,
    height: 20,
    border: "1px solid var(--color-green)",
    backgroundColor: "var(--color-green)",
    backgroundImage:
      'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxMiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIuMjY1NjMgNS45OTkyMkw1LjQ2NTYzIDguNzk5MjJMOS43MzIyOSAzLjE5OTIyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEuNCIvPgo8L3N2Zz4K")',
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    "input:hover ~ &": {
      border: "1px solid var(--color-darkest-grey)",
      backgroundColor: "var(--color-darkest-grey)",
    },
  },
});
export function Checkbox(props: {
  checked: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}): ReactNode {
  const classes = useStyles();

  return (
    <MuiCheckbox
      className={classes.root}
      disableRipple
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      inputProps={{
        width: 20,
        height: 20,
        "aria-label": "decorative checkbox",
      }}
      {...props}
    />
  );
}
