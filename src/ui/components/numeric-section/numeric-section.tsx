import clsx from "clsx";
import { ReactNode } from "react";

import { Icon } from "@/ui/components/icon/icon";
import { Tooltip } from "@/ui/components/tooltip/tooltip";

import styles from "./numeric-section.module.css";

export function NumericSection({
  className = "",
  title,
  value,
  postfix,
  caption,
  image,
  tooltip,
}: {
  className?: string;
  title: string;
  value: number | string;
  postfix?: string;
  caption?: string;
  image?: { url: string; background: string };
  tooltip?: string | ReactNode;
}): ReactNode {
  return (
    <div className={clsx("round no-overflow bg-white", className)}>
      <div
        className={clsx("flex row align-center justify-between card2824", {
          [styles.small]: !image,
        })}
      >
        <div className={"flex row gap24"}>
          {image ? (
            <Icon
              className={clsx("flex center", image.background, styles.icon)}
            >
              <img src={image.url} alt={""} />
            </Icon>
          ) : null}
          <div className={"flex col gap12"}>
            <div className={"flex row"}>
              <p className={clsx("bold", styles.title)}>{title}</p>
              {tooltip ? <Tooltip text={tooltip} /> : null}
            </div>
            <div className={"flex col"}>
              <h6>
                {value}{" "}
                {postfix ? (
                  <span className={"small bold"}>{postfix}</span>
                ) : null}
              </h6>
              {caption ? <p className={"bold"}>{caption}</p> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
