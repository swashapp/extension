import {
  MenuItem,
  Select as MuiSelect,
  SelectChangeEvent,
} from "@mui/material";
import clsx from "clsx";
import { ReactNode, useEffect, useState } from "react";

import { SelectItem } from "@/types/ui.type";
import { Label } from "@/ui/components/label/label";
import ArrowIcon from "~/images/icons/arrow-1.svg?react";

import { InputBase } from "./input-base";
import styles from "./select.module.css";

export function Select({
  label,
  value: initialValue,
  items,
  captions,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  items: SelectItem[];
  captions?: ReactNode[];
  onChange?: (event: SelectChangeEvent<string>) => void;
  disabled?: boolean;
}): ReactNode {
  const [value, setValue] = useState(initialValue);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setValue(event.target.value);
    if (onChange) onChange(event);
    handleClose();
  };

  return (
    <Label id={`customized-select-${value}`} text={label}>
      <MuiSelect
        displayEmpty={true}
        IconComponent={() => (
          <ArrowIcon
            className={clsx("absolute", styles.icon, {
              [styles.revert]: open,
            })}
          />
        )}
        className={`flex center ${styles.container}`}
        id={`customized-select-${value}`}
        value={value}
        onChange={handleChange}
        onOpen={handleOpen}
        onClose={handleClose}
        MenuProps={{
          disableScrollLock: true,
          PaperProps: {
            className: styles.menu,
            sx: {
              borderRadius: "12px",
              marginTop: "8px",
            },
          },
        }}
        disabled={disabled}
        input={<InputBase />}
        renderValue={(selectedValue) => {
          const item = items.find((item) => item.value === selectedValue);

          return (
            <div className={"flex align-center gap8"}>
              {item?.icon ? (
                <img
                  width={20}
                  height={20}
                  src={item.icon}
                  alt={item.value}
                ></img>
              ) : null}
              <span className={styles.value}>{item?.display}</span>
            </div>
          );
        }}
      >
        {items.map((item, index) => (
          <MenuItem
            key={item.value}
            value={item.value}
            style={{ width: "auto" }}
          >
            <div className={"flex col"} style={{ width: "100%" }}>
              <div className={"flex align-center gap8"}>
                {item.icon ? (
                  <img
                    width={20}
                    height={20}
                    src={item.icon}
                    alt={item.value}
                  ></img>
                ) : null}
                <div className={styles.item}>{item.display}</div>
              </div>
              {captions && captions[index] ? captions[index] : null}
            </div>
          </MenuItem>
        ))}
      </MuiSelect>
    </Label>
  );
}
