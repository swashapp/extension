import clsx from "clsx";
import { ReactNode } from "react";

import { Link } from "@/ui/components/link/link";
import { PageHeader } from "@/ui/components/page-header/page-header";
import { PunchedBox } from "@/ui/components/punched-box/punched-box";
import { EarnMoreItems } from "@/ui/data/earn-more-items";

import styles from "./earn-more.module.css";

export function EarnMore(): ReactNode {
  return (
    <>
      <PageHeader header={"Earn More"} />
      <div className={"flex col gap32"}>
        <div className={"round no-overflow flex col gap32 bg-white card28"}>
          <p>
            Currently in beta, Swash Earn enables verified Swash app members to
            turbo boost their earnings by opting in four new ways to earn
            online.
          </p>
          <div className={"flex wrap justify-between gap16"}>
            {EarnMoreItems.map(({ title, subtitle, image, link }, index) => {
              const children = (
                <div className={styles.body}>
                  <div className={styles.image}>
                    <img src={image} alt={title} />
                  </div>
                  <div>
                    <p className={"subHeader2"}>{title}</p>
                    <p className={"large"}>{subtitle}</p>
                  </div>
                </div>
              );

              return (
                <Link
                  url={link}
                  key={`earn-option-${index}`}
                  className={clsx("flex col justify-end", styles.option)}
                  external={link.startsWith("http")}
                  newTab={link.startsWith("http")}
                >
                  <PunchedBox className={"card32 border-box relative"}>
                    {children}
                  </PunchedBox>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
