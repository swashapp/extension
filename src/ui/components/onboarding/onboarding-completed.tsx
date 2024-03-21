import clsx from "clsx";
import { ReactNode, useContext, useEffect } from "react";

import { OnboardingFlows } from "@/enums/onboarding.enum";
import { helper } from "@/helper";
import { InternalRoutes } from "@/paths";
import { Button } from "@/ui/components/button/button";
import { DashboardContext } from "@/ui/context/dashboard.context";
import { OnboardingContext } from "@/ui/context/onboarding.context";

import styles from "./onboarding-completed.module.css";

export function OnboardingCompleted(): ReactNode {
  const { update } = useContext(DashboardContext);
  const { flow } = useContext(OnboardingContext);

  useEffect(() => {}, []);

  return (
    <div
      className={clsx(
        "round no-overflow flex col gap32 bg-white card32",
        styles.container,
      )}
    >
      <img
        className={clsx("absolute", styles.button)}
        src={"/images/shape/cross.svg"}
        alt={"close"}
        width={10}
        height={10}
        onClick={async () => {
          await helper("coordinator").set("isActive", false);
          update(false, InternalRoutes.profile);
        }}
      />
      <div className={"flex col gap12"}>
        <h6>Congratulations!</h6>
        <p>
          {flow === OnboardingFlows.REGISTER
            ? "Your Swash account has been created."
            : "Logged in to your account successfully."}
        </p>
      </div>
      <p>
        When you use Swash, you’re in control of the data you share. You can
        always control what data Swash collects in the ‘Data’ page of the
        extension, or pause data collection by turning the toggle off anytime
        from the Swash popup window.
      </p>
      <div className={"text-center"}>
        <img
          className={clsx("round", styles.image)}
          src={"/images/misc/turn-on-swash.webp"}
          alt={"turn on swash"}
          width={"50%"}
          height={"auto"}
        />
      </div>
      <p>Swash can only collect your data if you press the button below.</p>
      <div className={"flex center"}>
        <Button
          text={"Turn Swash On"}
          onClick={async () => {
            await helper("coordinator").set("isActive", true);
            update(false, InternalRoutes.profile);
          }}
        />
      </div>
    </div>
  );
}
