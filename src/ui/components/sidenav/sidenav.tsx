import clsx from "clsx";
import { ReactNode, useContext } from "react";

import { DisplayAds } from "@/ui/components/display-ads/display-ads";
import { SwashLogo } from "@/ui/components/swash-logo/swash-logo";
import { SidenavContext } from "@/ui/context/sidenav.context";

import { SidenavLinks } from "./sidenav-links";
import styles from "./sidenav.module.css";

export function Sidenav({ activeIndex }: { activeIndex?: number }): ReactNode {
  const { isOpen, setOpen } = useContext(SidenavContext);
  return (
    <div
      className={clsx(
        "flex col bg-white",
        styles.container,
        styles[isOpen ? "open" : "close"],
      )}
    >
      <div className={"flex col justify-between"}>
        <div>
          <div
            className={clsx(
              "flex row justify-between align-center",
              styles.logo,
            )}
          >
            <SwashLogo />
            {isOpen ? (
              <div className={styles.button} onClick={() => setOpen(false)}>
                <img
                  width={14}
                  height={14}
                  src={"/images/icons/sidenav/close.png"}
                  alt={"x"}
                />
              </div>
            ) : null}
          </div>
          <div className={"flex col"}>
            <SidenavLinks activeIndex={activeIndex} />
          </div>
        </div>
        <div className={styles.ads}>
          <DisplayAds width={250} height={250} />
        </div>
      </div>
    </div>
  );
}
