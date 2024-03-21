import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from "@mui/material";
import clsx from "clsx";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  HashRouter as Router,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import { InitialAccountInfoRes } from "@/core/data/initial-cache";
import { helper } from "@/helper";
import { InternalRoutes } from "@/paths";
import { Any } from "@/types/any.type";
import { AccountInfoRes } from "@/types/api/account.type";
import { Popup } from "@/ui/components/popup/popup";
import { Sidenav } from "@/ui/components/sidenav/sidenav";
import { ToastContainer } from "@/ui/components/toast/toast-container";
import { DashboardContext } from "@/ui/context/dashboard.context";
import { SidenavContext } from "@/ui/context/sidenav.context";
import { SidenavItems } from "@/ui/data/sidenav-items";
import { useErrorHandler } from "@/ui/hooks/use-error-handler";

import styles from "./dashboard.module.css";
import { Onboarding } from "./onboarding";

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

function RouteComponent(
  ExtensionComponent: () => ReactNode,
  activeIndex: number,
) {
  return (
    <>
      <Sidenav activeIndex={activeIndex} />
      <div className={clsx("no-overflow relative", styles.page)}>
        <div className={clsx("border-box", styles.content)}>
          <ExtensionComponent />
        </div>
      </div>
    </>
  );
}

function App(): ReactNode {
  const { safeRun } = useErrorHandler();
  const navigate = useNavigate();

  const [account, setAccount] = useState<AccountInfoRes>(InitialAccountInfoRes);
  const [onboarding, setOnboarding] = useState<boolean>(false);
  const [sidenavOpen, setSidenavOpen] = useState<boolean>(true);

  const updateStatus = useCallback(
    (refresh: boolean) => {
      safeRun(async () => {
        const onboarding = await helper("coordinator").isInOnboarding(true);
        setOnboarding(onboarding);

        if (!onboarding)
          setAccount(await helper("user").getAccountDetails(refresh));
      });
    },
    [safeRun],
  );

  useEffect(() => {
    updateStatus(false);
  }, [updateStatus]);

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
          update: (refresh: boolean, path?: string) => {
            updateStatus(refresh);
            if (path) navigate(path);
          },
        }}
      >
        {onboarding ? (
          <Routes>
            <Route path={InternalRoutes.onboarding} element={<Onboarding />} />
            <Route element={<Navigate to={InternalRoutes.onboarding} />} />
          </Routes>
        ) : (
          <Routes>
            {SidenavItems.map((link, index) => (
              <Route
                key={link.title}
                path={link.route}
                element={
                  <SidenavContext.Provider
                    value={{
                      isOpen: sidenavOpen,
                      setOpen: setSidenavOpen,
                    }}
                  >
                    {RouteComponent(link.component, index)}
                  </SidenavContext.Provider>
                }
              />
            ))}
            <Route
              path={"/"}
              element={<Navigate to={InternalRoutes.profile} />}
            />
          </Routes>
        )}
      </DashboardContext.Provider>
    </div>
  );
}

const theme = createTheme();
const container = document.getElementById("dashboard");
const root = createRoot(container!);
root.render(
  <Router>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <App />
        <Popup />
        <ToastContainer />
      </ThemeProvider>
    </StyledEngineProvider>
  </Router>,
);
