import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import clsx from "clsx";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";

import { helper } from "@/helper";
import { InternalPaths } from "@/paths";
import { Any } from "@/types/any.type";
import { DisplayAds } from "@/ui/components/display-ads/display-ads";
import { SwashLogo } from "@/ui/components/swash-logo/swash-logo";
import { Toggle } from "@/ui/components/toggle/toggle";
import { useAccountBalance } from "@/ui/hooks/use-account-balance";
import { getExtensionURL } from "@/utils/browser.util";

import styles from "./popup.module.css";

import "../styles/main.css";
import "../styles/common.css";
import "../styles/devices.css";
import "../styles/themes.css";

declare global {
  interface Window {
    helper: Any;
  }
}
window.helper = helper;

function MenuItem(props: {
  onClick: () => void;
  iconClassName: string;
  text: string;
  badge?: ReactNode;
}) {
  return (
    <div
      onClick={props.onClick}
      className={clsx("flex align-center gap16", styles.item)}
    >
      <div className={props.iconClassName} />
      <p className={"bold"}>{props.text}</p>
      {props.badge ? props.badge : ""}
    </div>
  );
}

function App() {
  const { balance, balanceInUSD } = useAccountBalance();

  const [needOnBoarding, setNeedOnBoarding] = useState<boolean>(true);
  const showPageOnTab = useCallback(async (url: string) => {
    await browser.windows.getAll({
      populate: true,
      windowTypes: ["normal"],
    });
    browser.tabs.create({ url, active: true }).then(() => {
      window.close();
    });
  }, []);

  useEffect(() => {
    const checkOnboarding = async () => {
      const _needOnBoarding = await helper("coordinator").isInOnboarding(true);
      setNeedOnBoarding(_needOnBoarding);
    };

    checkOnboarding().catch((error) => {
      console.error("Error in useEffect:", error);
    });
  }, [showPageOnTab]);

  return (
    <>
      {needOnBoarding ? null : (
        <div className={clsx("bg-white", styles.container)}>
          <div className={clsx("flex col", styles.menu)}>
            <div className={"flex align-center justify-between"}>
              <div className={"flex align-center"}>
                <SwashLogo className={styles.logo} />
              </div>
              <Toggle />
            </div>
            <div className={clsx("flex gap16", styles.numerics)}>
              <div className={"flex col col-10 border-box"}>
                <p className={"small"}>Balance</p>
                <p className={"large bold"}>
                  {balance} SWASH{" "}
                  <span className={"smaller"}>~ {balanceInUSD} USDT</span>
                </p>
              </div>
            </div>
            <MenuItem
              text={"Earnings"}
              iconClassName={clsx(styles.icon, styles.wallet)}
              onClick={() =>
                showPageOnTab(getExtensionURL(InternalPaths.earnings))
              }
            />
            <MenuItem
              text={"Earn More"}
              iconClassName={clsx(styles.icon, styles.earn)}
              onClick={() =>
                showPageOnTab(getExtensionURL(InternalPaths.earnMore))
              }
            />
            <MenuItem
              text={"Settings"}
              iconClassName={clsx(styles.icon, styles.settings)}
              onClick={() =>
                showPageOnTab(getExtensionURL(InternalPaths.settings))
              }
            />
            <MenuItem
              text={"Help"}
              iconClassName={clsx(styles.icon, styles.help)}
              onClick={() => showPageOnTab(getExtensionURL(InternalPaths.help))}
            />
            <DisplayAds width={320} height={100} />
          </div>
        </div>
      )}
    </>
  );
}

const theme = createTheme();
const container = document.getElementById("popup");
const root = createRoot(container!);
root.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StyledEngineProvider>,
);
