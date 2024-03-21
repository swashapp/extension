import { StyledEngineProvider } from "@mui/material";
import clsx from "clsx";
import {
  ReactNode,
  useCallback,
  useEffect,
  useState,
  ComponentType,
} from "react";
import { createRoot } from "react-dom/client";
import {
  HashRouter as Router,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import { InitialAccountInfoRes } from "@/core/data/initial-cache";
import { AppStages } from "@/enums/app.enum";
import { helper } from "@/helper";
import { DASHBOARD_PATHS } from "@/paths";
import { Any } from "@/types/any.type";
import { AccountInfoRes } from "@/types/api/account.type";
import { Popup } from "@/ui/components/popup/popup";
import { Sidebar } from "@/ui/components/sidebar/sidebar";
import { SwashLogo } from "@/ui/components/swash-logo/swash-logo";
import { ToastContainer } from "@/ui/components/toast/toast-container";
import { DashboardContext } from "@/ui/context/dashboard.context";
import { ThemeProvider } from "@/ui/context/theme.context";
import { SidebarLinks, SidebarMigrationLinks } from "@/ui/data/sidebar-links";
import { useErrorHandler } from "@/ui/hooks/use-error-handler";
import { Onboarding } from "@/ui/pages/onboarding";

import styles from "./dashboard.module.css";

import "../styles/main.css";
import "../styles/common.css";
import "../styles/devices.css";

declare global {
  interface Window {
    helper: Any;
  }
}
window.helper = helper;

function RouteComponent(Component: ComponentType<Any>): ReactNode {
  return (
    <div className={clsx("no-overflow relative", styles.page)}>
      <div className={clsx("border-box", styles.content)}>
        <div className={clsx("flex row", styles.logo)}>
          <SwashLogo />
        </div>
        <Component />
      </div>
    </div>
  );
}

function App(): ReactNode {
  const { safeRun } = useErrorHandler();
  const navigate = useNavigate();

  const [account, setAccount] = useState<AccountInfoRes>(InitialAccountInfoRes);
  const [stage, setStage] = useState<AppStages>(AppStages.INITIAL);

  const update = useCallback(
    async (path?: string) => {
      await safeRun(async () => {
        const stage = (await helper("coordinator").get("stage")) as AppStages;
        if (stage === AppStages.READY)
          setAccount(await helper("user").getAccountDetails());
        setStage(stage);
        if (path) navigate(path);
      });
    },
    [navigate, safeRun],
  );

  useEffect(() => {
    update().then();
  }, [update]);

  return (
    <div
      className={clsx(
        "flex row nowrap relative bg-lightest-grey",
        styles.container,
      )}
    >
      <DashboardContext.Provider
        value={{
          account,
          update,
        }}
      >
        {stage === AppStages.ONBOARDING ? (
          <Routes>
            <Route path={DASHBOARD_PATHS.onboarding} element={<Onboarding />} />
            <Route element={<Navigate to={DASHBOARD_PATHS.onboarding} />} />
          </Routes>
        ) : (
          <>
            <Sidebar />
            <Routes>
              {(stage === AppStages.MIGRATING
                ? SidebarMigrationLinks
                : SidebarLinks
              ).map((link) => (
                <Route
                  key={link.title}
                  path={link.route}
                  element={RouteComponent(link.component)}
                />
              ))}
              <Route element={<Navigate to={DASHBOARD_PATHS.profile} />} />
            </Routes>
          </>
        )}
      </DashboardContext.Provider>
    </div>
  );
}

const container = document.getElementById("dashboard");
const root = createRoot(container!);
root.render(
  <Router>
    <StyledEngineProvider injectFirst>
      <ThemeProvider>
        <App />
        <Popup />
        <ToastContainer />
      </ThemeProvider>
    </StyledEngineProvider>
  </Router>,
);
