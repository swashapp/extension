import clsx from "clsx";
import { ReactNode } from "react";

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
  image?: string;
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
            <div className={clsx("flex center", styles.icon)}>
              <img src={image} alt={""} />
            </div>
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
