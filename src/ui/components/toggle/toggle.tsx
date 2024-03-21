import clsx from "clsx";
import { ReactNode, useCallback, useEffect, useState } from "react";

import { helper } from "@/helper";
import { Switch } from "@/ui/components/switch/switch";

import styles from "./toggle.module.css";

export function Toggle(): ReactNode {
  const [status, setStatus] = useState<boolean>(false);

  const onStatusChanged = useCallback(async (checked: boolean) => {
    await helper("coordinator").set("isActive", checked);
    setStatus(checked);
  }, []);

  useEffect(() => {
    helper("coordinator")
      .get("isActive")
      .then((value) => {
        setStatus(value as boolean);
      });
  }, []);

  return (
    <div className={"flex center gap8"}>
      <p className={clsx("smaller bold", styles.label)}>
        {status ? "ON" : "OFF"}
      </p>
      <Switch
        checked={status}
        onChange={(e) => onStatusChanged(e.target.checked)}
      />
    </div>
  );
}
