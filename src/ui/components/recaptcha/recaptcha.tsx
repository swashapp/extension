import clsx from "clsx";
import { useEffect, useState } from "react";

import { ButtonColors } from "@/enums/button.enum";
import { WEBSITE_URLs } from "@/paths";
import { Button } from "@/ui/components/button/button";
import { WaitingProgressBar } from "@/ui/components/progress/waiting-progress";
import { useTheme } from "@/ui/context/theme.context";

import styles from "./recaptcha.module.css";

export function Recaptcha({
  className = "",
  onBack,
  onDataReceived,
}: {
  className?: string;
  onBack: () => void;
  onDataReceived: ({
    token,
    referral,
  }: {
    token: string;
    referral: string;
  }) => void;
}) {
  const { theme } = useTheme();
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    window.onmessage = (
      event: MessageEvent<{ token: string; referral: string }>,
    ) => {
      onDataReceived(event.data);
    };
  }, [onDataReceived]);

  return (
    <div className={"flex col gap40"}>
      <div className={className}>
        <div className={clsx("flex col justify-center", styles.container)}>
          {visible ? null : <WaitingProgressBar />}
          <iframe
            title={"Human Check"}
            src={`${WEBSITE_URLs.recaptcha}?theme=${theme}`}
            scrolling={"no"}
            style={{
              height: "100%",
              border: "none",
              overflow: "hidden",
              display: visible ? "unset" : "none",
            }}
            onLoad={() => setVisible(true)}
          >
            <p>Your browser does not support iframe.</p>
          </iframe>
        </div>
        <Button text={"Back"} color={ButtonColors.SECONDARY} onClick={onBack} />
      </div>
    </div>
  );
}
