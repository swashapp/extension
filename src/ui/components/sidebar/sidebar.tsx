import clsx from "clsx";
import { ReactNode, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { DisplayAds } from "@/ui/components/display-ads/display-ads";
import { SwashLogo } from "@/ui/components/swash-logo/swash-logo";
import { SidebarLink, SidebarLinks } from "@/ui/data/sidebar-links";

import styles from "./sidebar.module.css";

export function Sidebar(): ReactNode {
  const [active, setActive] = useState<number>(-1);

  const location = useLocation();
  const currentPath = location.pathname;

  const Links = useMemo(
    () =>
      SidebarLinks.filter((item) => !item.hidden).map(
        (item: SidebarLink, index: number) => {
          const activeStyle =
            index === active || item.route === currentPath
              ? styles.active
              : styles.inactive;
          const IconComponent = item.icon;

          return (
            <div
              key={item.title + index}
              onClick={() => setActive(index)}
              className={clsx("flex row", styles.link, activeStyle)}
            >
              <div className={clsx(styles.border, activeStyle)} />
              <Link to={item.route}>
                <div
                  className={clsx("flex row nowrap align-center", styles.body)}
                >
                  {IconComponent ? (
                    <IconComponent className={styles.icon} />
                  ) : null}
                  <p className={"bold"}>{item.title}</p>
                </div>
              </Link>
            </div>
          );
        },
      ),
    [active, currentPath],
  );

  return (
    <div className={clsx("flex col bg-white", styles.container)}>
      <div className={"flex col"}>
        <div className={clsx("flex row bg-white", styles.logo)}>
          <SwashLogo />
        </div>
        <div className={clsx("flex col bg-white", styles.links)}>{Links}</div>
        <div className={styles.ads}>
          <DisplayAds width={250} height={250} />
        </div>
      </div>
    </div>
  );
}
