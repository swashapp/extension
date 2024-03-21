import clsx from "clsx";
import { ReactNode, SyntheticEvent } from "react";

import BackIcon from "~/images/icons/arrow-2.svg?react";

import styles from "./back.module.css";

export function BackButton({
  text,
  onClick,
}: {
  text?: string;
  onClick: (e: SyntheticEvent) => void;
}): ReactNode {
  return (
    <a
      className={clsx("flex align-center gap8", styles.container)}
      onClick={onClick}
    >
      <BackIcon className={clsx("rotate270", styles.icon)} />
      {text ? <p className={"bold"}>{text}</p> : null}
    </a>
  );
}
