import clsx from "clsx";

import { useColorScheme } from "@/ui/hooks/use-color-scheme";

import { Switch } from "../switch/switch";

import styles from "./dark-mode-toggle.module.css";

export const DarkModeToggle = () => {
  const { isDark, setIsDark } = useColorScheme();

  return (
    <div className={clsx("flex row center gap12", styles.container)}>
      <img
        src={"/images/shape/sun.svg"}
        alt={"light"}
        className={clsx({ [styles.active]: !isDark })}
      />
      <Switch
        checked={!!isDark}
        onChange={({ target }) => setIsDark(target.checked)}
      />
      <img
        src={"/images/shape/moon.svg"}
        alt={"dark"}
        className={clsx({ [styles.active]: isDark })}
      ></img>
    </div>
  );
};
