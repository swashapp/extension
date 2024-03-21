import clsx from "clsx";
import { ReactNode } from "react";

import { SystemMessage } from "@/enums/message.enum";
import { CopyEndAdornment } from "@/ui/components/input/end-adornments/copy-end-adornment";

import { DarkModeToggle } from "../toggle/dark-mode-toggle";

import styles from "./page-header.module.css";

export function PageHeader({
  header,
  uid,
}: {
  header: string;
  uid?: string;
}): ReactNode {
  return (
    <div className={clsx("flex justify-between", styles.container)}>
      <h6>{header}</h6>
      <div className={"flex align-center gap40"}>
        {uid ? (
          <div className={clsx("flex gap4 align-center relative", styles.uid)}>
            <p className={"small"}>Your UID: {uid}</p>
            <CopyEndAdornment
              value={uid}
              toast={SystemMessage.SUCCESSFULLY_COPIED_WALLET_ADDRESS}
            />
          </div>
        ) : null}
        <DarkModeToggle />
      </div>
    </div>
  );
}
