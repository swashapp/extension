import { Checkbox } from "@mui/material";
import clsx from "clsx";
import { ReactNode, useState } from "react";

import HeartIcon from "~/images/icons/heart.svg?react";

import styles from "./fav.module.css";

export function FavButton({
  enable,
  onClick,
}: {
  enable: boolean;
  onClick: (e: boolean) => void;
}): ReactNode {
  const [status, setStatus] = useState(enable);

  return (
    <Checkbox
      checked={status}
      onClick={() => {
        onClick(!status);
        setStatus(!status);
      }}
      icon={<HeartIcon className={styles.heart} />}
      checkedIcon={<HeartIcon className={clsx(styles.heart, styles.filled)} />}
    />
  );
}
