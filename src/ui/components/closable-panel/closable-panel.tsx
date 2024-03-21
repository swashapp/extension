import clsx from "clsx";
import { ReactNode, useState } from "react";

import CloseIcon from "~/images/icons/cross.svg?react";

import styles from "./closable-panel.module.css";

export function ClosablePanel({
  className,
  onClose,
  children,
}: {
  className?: string;
  onClose?: () => void;
  children: ReactNode;
}): ReactNode {
  const [hide, setHide] = useState<boolean>(false);
  const [close, setClose] = useState<boolean>(false);

  return (
    <div
      className={clsx(
        "relative",
        styles[close ? "close" : "open"],
        { hide: hide },
        className,
      )}
    >
      <CloseIcon
        className={clsx("absolute pointer", styles.icon)}
        onClick={() => {
          onClose && onClose();
          setClose(true);
          setTimeout(() => {
            setHide(true);
          }, 1000);
        }}
      />
      {children}
    </div>
  );
}
