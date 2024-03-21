import clsx from "clsx";
import { ReactNode } from "react";

import { WEBSITE_URLs } from "@/paths";
import { Link } from "@/ui/components/link/link";
import { useTheme } from "@/ui/context/theme.context";
import { getAppVersion } from "@/utils/browser.util";

import styles from "./swash-logo.module.css";

const lightLogo = "/images/logos/swash-dark.svg";
const darkLogo = "/images/logos/swash-white.svg";

export function SwashLogo({
  className = styles.logo,
}: {
  className?: string;
}): ReactNode {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const logo = isDark ? darkLogo : lightLogo;

  return (
    <div className={"flex align-center gap8"}>
      <Link url={WEBSITE_URLs.home} external className={className}>
        <img className={styles.logo} src={logo} alt={"Swash"} />
      </Link>
      <p className={clsx("small bold", styles.version)}>{getAppVersion()}.</p>
    </div>
  );
}
