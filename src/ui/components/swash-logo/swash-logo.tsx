import clsx from "clsx";
import { ReactNode } from "react";

import { WebsiteURLs } from "@/paths";
import { Link } from "@/ui/components/link/link";
import { useColorScheme } from "@/ui/hooks/use-color-scheme";
import { getAppVersion } from "@/utils/browser.util";

import styles from "./swash-logo.module.css";

const lightLogo = "/images/logos/swash-dark.svg";
const darkLogo = "/images/logos/swash-white.svg";

export function SwashLogo({
  className = styles.logo,
}: {
  className?: string;
}): ReactNode {
  const { isDark } = useColorScheme();
  const logo = isDark ? darkLogo : lightLogo;

  return (
    <div className={"flex align-center gap8"}>
      <Link url={WebsiteURLs.home} external className={className}>
        <img className={styles.logo} src={logo} alt={"Swash"} />
      </Link>
      <p className={clsx("small bold", styles.version)}>{getAppVersion()}.</p>
    </div>
  );
}
