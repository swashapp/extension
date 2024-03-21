import clsx from "clsx";
import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";

import { SidenavItem, SidenavItems } from "@/ui/data/sidenav-items";

import styles from "./sidenav-links.module.css";

export function SidenavLinks({
  activeIndex = 0,
}: {
  activeIndex?: number;
}): ReactNode {
  const [active, setActive] = useState<number>(activeIndex || 0);

  return SidenavItems.filter((item) => !item.hidden).map(
    (item: SidenavItem, index: number) => {
      const activeStyle = index === active ? styles.active : styles.inactive;
      const IconComponent = item.icon;

      return (
        <div
          key={item.title + index}
          onClick={() => setActive(index)}
          className={clsx("flex row", styles.link, activeStyle)}
        >
          <div className={clsx(styles.border, activeStyle)} />
          <Link to={item.route}>
            <div className={clsx("flex row nowrap align-center", styles.body)}>
              {IconComponent ? <IconComponent className={styles.icon} /> : null}
              <p className={"bold"}>{item.title}</p>
            </div>
          </Link>
        </div>
      );
    },
  );
}
