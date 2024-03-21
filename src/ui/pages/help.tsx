import clsx from "clsx";
import { ReactNode } from "react";

import { SUPPORT_URLS } from "@/paths";
import { Link } from "@/ui/components/link/link";
import { PageHeader } from "@/ui/components/page-header/page-header";
import { HelpItems } from "@/ui/data/help-items";

import styles from "./help.module.css";

export function Help(): ReactNode {
  return (
    <>
      <PageHeader header={"Help"} />
      <div className={"flex col gap32"}>
        <div className={"round no-overflow flex col gap24 bg-white card28"}>
          <p>
            Got a question? Check out each section below for FAQs on the
            different sides of Swash.
          </p>
          <div className={clsx("flex wrap gap20", styles.container)}>
            {HelpItems.map(({ title, image, className, link }, index) => (
              <Link
                url={link}
                className={clsx(
                  "relative flex col justify-end",
                  styles.option,
                  className,
                )}
                external={link.startsWith("http")}
                newTab={link.startsWith("http")}
                key={`help-option-${index}`}
              >
                <img
                  className={clsx("absolute", styles.image)}
                  src={image}
                  alt={title}
                />
                <p className={"large"}>{title}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className={"round no-overflow bg-white card28"}>
          <p className={"large bold"}>Can’t find your answer? Contact Swash.</p>
          <p>
            Submit a support request{" "}
            <Link url={SUPPORT_URLS.home} external newTab>
              here
            </Link>{" "}
            and someone will get back to you within 48 hours.
          </p>
        </div>
      </div>
    </>
  );
}
