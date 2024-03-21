import clsx from "clsx";
import { useEffect, useState } from "react";

import { ButtonColors } from "@/enums/button.enum";
import { WebsiteURLs } from "@/paths";
import { Button } from "@/ui/components/button/button";
import { WaitingProgressBar } from "@/ui/components/progress/waiting-progress";

import styles from "./recaptcha.module.css";

export function Recaptcha({
  className = "",
  onBack,
  onTokenReceived,
  onReferralReceived,
}: {
  className?: string;
  onBack: () => void;
  onTokenReceived: (token: string) => void;
  onReferralReceived?: (referral: string) => void;
}) {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    window.onmessage = (
      event: MessageEvent<{ token: string; referral: string }>,
    ) => {
      onTokenReceived(event.data.token);
      onReferralReceived && onReferralReceived(event.data.referral);
    };
  }, [onReferralReceived, onTokenReceived]);

  return (
    <div className={"flex col gap40"}>
      <div className={className}>
        <div className={clsx("flex col justify-center", styles.container)}>
          {visible ? null : <WaitingProgressBar />}
          <iframe
            title={"Human Check"}
            src={WebsiteURLs.recaptcha}
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
