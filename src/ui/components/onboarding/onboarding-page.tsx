import clsx from "clsx";
import { ReactNode } from "react";

import styles from "./onboarding-page.module.css";

export function OnboardingPage({
  title,
  navigation,
  children,
}: {
  title?: string;
  navigation?: ReactNode;
  children: ReactNode;
}): ReactNode {
  return (
    <div className={clsx("flex col gap32", styles.container)}>
      {title ? <h6>{title}</h6> : null}
      <div className={"round no-overflow flex col gap56 bg-white card32"}>
        <div className={"flex col gap24"}>{children}</div>
      </div>
      {navigation}
    </div>
  );
}
