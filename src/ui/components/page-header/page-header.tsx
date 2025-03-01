import clsx from "clsx";
import { ReactNode, useContext } from "react";

import { SystemMessage } from "@/enums/message.enum";
import { CopyEndAdornment } from "@/ui/components/input/end-adornments/copy-end-adornment";
import { DarkModeToggle } from "@/ui/components/toggle/dark-mode-toggle";
import { DashboardContext } from "@/ui/context/dashboard.context";
import { purgeString } from "@/utils/string.util";

import styles from "./page-header.module.css";

export function PageHeader({
  header,
  uid = true,
}: {
  header: string;
  uid?: boolean;
}): ReactNode {
  const { account } = useContext(DashboardContext);
  const wallet = account.wallet;

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
              <p className={"small"}>Your UID: {wallet}</p>
              <CopyEndAdornment
                value={wallet}
                toast={SystemMessage.SUCCESSFULLY_COPIED_WALLET_ADDRESS}
                className={styles.position}
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
          <p className={"small"}>Your UID: {purgeString(wallet)}</p>
          <CopyEndAdornment
            value={wallet}
            toast={SystemMessage.SUCCESSFULLY_COPIED_WALLET_ADDRESS}
          />
        </div>
      ) : null}
    </div>
  );
}
