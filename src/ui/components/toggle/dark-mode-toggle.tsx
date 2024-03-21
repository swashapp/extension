import clsx from "clsx";

import { Switch } from "@/ui/components/switch/switch";
import { useTheme } from "@/ui/context/theme.context";
import MoonIcon from "~/images/icons/moon.svg?react";
import SunIcon from "~/images/icons/sun.svg?react";

import styles from "./dark-mode-toggle.module.css";

export const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={clsx("flex row center gap12", styles.container)}>
      <SunIcon className={clsx({ [styles.active]: !isDark })} />
      <Switch checked={isDark} onChange={() => toggleTheme()} />
      <MoonIcon className={clsx({ [styles.active]: isDark })} />
    </div>
  );
};
