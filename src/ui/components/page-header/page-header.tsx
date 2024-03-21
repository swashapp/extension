import clsx from "clsx";
import { ReactNode } from "react";

import { SystemMessage } from "@/enums/message.enum";
import { CopyEndAdornment } from "@/ui/components/input/end-adornments/copy-end-adornment";
import { DarkModeToggle } from "@/ui/components/toggle/dark-mode-toggle";
import { purgeString } from "@/utils/string.util";

import styles from "./page-header.module.css";

export function PageHeader({
  header,
  uid,
}: {
  header: string;
  uid?: string;
}): ReactNode {
  return (
    <div className={clsx("flex col gap16", styles.container)}>
      <div className={"flex justify-between"}>
        <h6>{header}</h6>
        <div className={"flex align-center gap24"}>
          {uid ? (
            <div
              className={clsx(
                "flex gap4 align-center relative",
                styles.uid,
                styles.desktop,
              )}
            >
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
      {uid ? (
        <div
          className={clsx(
            "flex gap4 align-center relative",
            styles.uid,
            styles.mobile,
          )}
        >
          <p className={"small"}>Your UID: {purgeString(uid)}</p>
          <CopyEndAdornment
            value={uid}
            toast={SystemMessage.SUCCESSFULLY_COPIED_WALLET_ADDRESS}
          />
        </div>
      ) : null}
    </div>
  );
}
