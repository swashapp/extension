import { Checkbox as MuiCheckbox } from "@mui/material";
import clsx from "clsx";
import { ChangeEvent, ReactNode } from "react";

import styles from "./checkbox.module.css";

export function Checkbox(props: {
  checked: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  label: ReactNode;
}): ReactNode {
  const { label, ...rest } = props;
  const checkboxId = `custom-checkbox-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={clsx("flex align-center pointer gap12", styles.root)}>
      <MuiCheckbox
        id={checkboxId}
        className={clsx("flex align-center pointer", styles.root)}
        disableRipple
        checkedIcon={<span className={clsx(styles.icon, styles.checkedIcon)} />}
        icon={<span className={styles.icon} />}
        inputProps={{
          width: 18,
          height: 18,
          "aria-label": "decorative checkbox",
        }}
        {...rest}
      />
      <label
        htmlFor={checkboxId}
        className={clsx("flex align-center pointer", styles.label)}
      >
        {label}
      </label>
    </div>
  );
}
