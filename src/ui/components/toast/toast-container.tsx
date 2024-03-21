import clsx from "clsx";
import { useEffect } from "react";
import { ToastContainer as TContainer } from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";

import styles from "./toast-container.module.css";

export function ToastContainer() {
  useEffect(() => {
    injectStyle();
  }, []);

  return (
    <TContainer
      toastClassName={clsx("bg-white", styles.container)}
      autoClose={5000}
      closeButton={true}
      hideProgressBar
      pauseOnHover
    />
  );
}
