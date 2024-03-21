import clsx from "clsx";
import { ReactNode } from "react";

import { Icon } from "../icon/icon";
import { Tooltip } from "../tooltip/tooltip";

import styles from "./numeric-section.module.css";

export function NumericSection({
  className = "",
  title,
  value,
  image,
  tooltip,
}: {
  className?: string;
  title: string;
  value: number | string;
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
          <div className={"flex col"}>
            <div className={"flex row"}>
              <p className={"smaller"}>{title}</p>
              {tooltip ? <Tooltip text={tooltip} /> : null}
            </div>
            <h4>{value}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
