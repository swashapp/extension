import clsx from "clsx";
import { ReactNode } from "react";

import { Link, LinkProps } from "@/ui/components/link/link";

import styles from "./icon-button.module.css";

function IconButtonBase({
  body,
  classname,
  image,
  imageSize,
  onClick,
}: {
  body?: string;
  classname?: string;
  image: string;
  imageSize?: { width?: number; height?: number };
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "flex center round pointer",
        styles.container,
        styles[body ? "large" : "small"],
        classname,
      )}
    >
      <div className={"flex align-center"}>
        <img
          src={image}
          alt={""}
          width={imageSize ? imageSize.width || 24 : 24}
          height={imageSize ? imageSize.height || 24 : 24}
        />
        {body ? <p className={styles.text}>{body}</p> : null}
      </div>
    </div>
  );
}

export function IconButton(props: {
  body?: string;
  classname?: string;
  image: string;
  imageSize?: { width?: number; height?: number };
  link?: LinkProps;
  onClick?: () => void;
}): ReactNode {
  return !props.link ? (
    <IconButtonBase {...props} />
  ) : (
    <Link {...props.link}>
      <IconButtonBase {...props} />
    </Link>
  );
}
