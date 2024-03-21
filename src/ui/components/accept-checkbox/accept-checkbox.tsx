import { Dispatch, ReactNode, SetStateAction } from "react";

import { Checkbox } from "@/ui/components/checkbox/checkbox";

import styles from "./accept-checkbox.module.css";

export function AcceptCheckBox({
  value,
  setValue,
  text,
}: {
  value: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
  text?: ReactNode;
}): ReactNode {
  return (
    <div className={"flex row align-center"}>
      <Checkbox checked={value} onChange={() => setValue((a) => !a)} />
      <div onClick={() => setValue((a) => !a)} className={styles.text}>
        <p className={"small"}>{text ?? <>I have read it and I agree</>}</p>
      </div>
    </div>
  );
}
