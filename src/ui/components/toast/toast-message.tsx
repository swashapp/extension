import clsx from "clsx";
import { ReactNode } from "react";
import { toast } from "react-toastify";

import styles from "./toast-message.module.css";

const Messages = {
  success: {
    title: "Success!",
    icon: "/images/icons/toast/success.svg",
    class: `${styles.message} ${styles.success}`,
  },
  error: {
    title: "Error!",
    icon: "/images/icons/toast/error.svg",
    class: `${styles.message} ${styles.error}`,
  },
};

export function toastMessage(
  type: keyof typeof Messages,
  content: ReactNode | string,
) {
  return toast(
    <div
      className={clsx(
        "flex align-center justify-between gap12",
        Messages[type].class,
      )}
    >
      <div className={"flex col"}>
        <p className={clsx("bold", styles.title)}>{Messages[type].title}</p>
        <p className={clsx("small", styles.text)}>{content}</p>
      </div>
      <img
        width={24}
        height={24}
        src={Messages[type].icon}
        alt={Messages[type].title}
      />
    </div>,
  );
}
