import { StyledEngineProvider } from "@mui/material";
import clsx from "clsx";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";

import { helper } from "@/helper";
import { INTERNAL_PATHS } from "@/paths";
import { Any } from "@/types/any.type";
import { DisplayAds } from "@/ui/components/display-ads/display-ads";
import { WaitingProgressBar } from "@/ui/components/progress/waiting-progress";
import { SwashLogo } from "@/ui/components/swash-logo/swash-logo";
import { Toggle } from "@/ui/components/toggle/toggle";
import { ThemeProvider } from "@/ui/context/theme.context";
import { useAccountBalance } from "@/ui/hooks/use-account-balance";
import { getExtensionURL } from "@/utils/browser.util";
import CoinsIcon from "~/images/icons/coins.svg?react";
import GearIcon from "~/images/icons/gear.svg?react";
import QuestionIcon from "~/images/icons/question.svg?react";
import WalletIcon from "~/images/icons/wallet.svg?react";

import styles from "./popup.module.css";

import "../styles/main.css";
import "../styles/common.css";
import "../styles/devices.css";

declare global {
  interface Window {
    helper: Any;
  }
}
window.helper = helper;

function MenuItem(props: {
  onClick: () => void;
  icon: ReactNode;
  text: string;
  badge?: ReactNode;
}) {
  return (
    <div
      onClick={props.onClick}
      className={clsx("flex align-center gap16", styles.item)}
    >
      {props.icon}
      <p className={"bold"}>{props.text}</p>
      {props.badge ? props.badge : ""}
    </div>
  );
}

function App() {
  const { balance, balanceInUSD } = useAccountBalance();

  const [isReady, setIsReady] = useState<boolean>(false);

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
    let retryCount = 0;
    const maxRetries = 30;

    const checkOnboarding = async () => {
      try {
        const isReady = await helper("coordinator").isReady();
        if (!isReady) await helper("coordinator").openPendingFlow();
        setIsReady(isReady);
      } catch (error) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(() => {
            checkOnboarding();
          }, 100);
        } else {
          console.error("Max retries reached. Stopping further attempts.");
        }
      }
    };

    checkOnboarding().then();
  }, [showPageOnTab]);

  if (!isReady)
    return (
      <div
        className={clsx(
          "bg-white flex col center gap24",
          styles.container,
          styles.loading,
        )}
      >
        <WaitingProgressBar showText={false} />
        <p className={"text-center"}>Please complete your pending flow</p>
      </div>
    );
  return (
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
          icon={<WalletIcon />}
          onClick={() =>
            showPageOnTab(getExtensionURL(INTERNAL_PATHS.earnings))
          }
        />
        <MenuItem
          text={"Earn More"}
          icon={<CoinsIcon />}
          onClick={() =>
            showPageOnTab(getExtensionURL(INTERNAL_PATHS.earnMore))
          }
        />
        <MenuItem
          text={"Settings"}
          icon={<GearIcon />}
          onClick={() =>
            showPageOnTab(getExtensionURL(INTERNAL_PATHS.settings))
          }
        />
        <MenuItem
          text={"Help"}
          icon={<QuestionIcon />}
          onClick={() => showPageOnTab(getExtensionURL(INTERNAL_PATHS.help))}
        />
        <DisplayAds width={320} height={100} />
      </div>
    </div>
  );
}

const container = document.getElementById("popup");
const root = createRoot(container!);
root.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StyledEngineProvider>,
);
