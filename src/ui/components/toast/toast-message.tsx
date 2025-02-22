import clsx from "clsx";
import { toast } from "react-toastify";

import { formatSentences } from "@/utils/string.util";

import styles from "./toast-message.module.css";

const Messages = {
  success: {
    title: "Success",
    icon: "/images/icons/success.svg",
    class: `${styles.message} ${styles.success}`,
  },
  error: {
    title: "Error",
    icon: "/images/icons/error.svg",
    class: `${styles.message} ${styles.error}`,
  },
};

function Message({
  type,
  content,
}: {
  type: keyof typeof Messages;
  content: string;
}) {
  return (
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
        width={32}
        height={32}
        src={Messages[type].icon}
        alt={Messages[type].title}
      />
    </div>
  );
}

export function toastMessage(type: keyof typeof Messages, content: string) {
  const errors = content.split("\n");

  errors.forEach((error, index) => {
    toast(
      <Message
        type={type}
        content={index === 0 ? formatSentences(error) : error}
      />,
    );
  });
}
