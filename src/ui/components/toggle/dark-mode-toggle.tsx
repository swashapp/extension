import clsx from "clsx";

import { Switch } from "@/ui/components/switch/switch";
import { useColorScheme } from "@/ui/hooks/use-color-scheme";
import MoonIcon from "~/images/icons/moon.svg?react";
import SunIcon from "~/images/icons/sun.svg?react";

import styles from "./dark-mode-toggle.module.css";

export const DarkModeToggle = () => {
  const { isDark, setIsDark } = useColorScheme();

  return (
    <div className={clsx("flex row center gap12", styles.container)}>
      <SunIcon className={clsx({ [styles.active]: !isDark })} />
      <Switch
        checked={!!isDark}
        onChange={({ target }) => setIsDark(target.checked)}
      />
      <MoonIcon className={clsx({ [styles.active]: isDark })} />
    </div>
  );
};
