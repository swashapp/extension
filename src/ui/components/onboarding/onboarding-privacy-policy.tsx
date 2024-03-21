import clsx from "clsx";
import { ReactNode, useContext, useState } from "react";

import { WEBSITE_URLs } from "@/paths";
import { Checkbox } from "@/ui/components/checkbox/checkbox";
import { NavigationButtons } from "@/ui/components/navigation-buttons/navigation-buttons";
import { OnboardingContext } from "@/ui/context/onboarding.context";

import styles from "./onboarding-privacy-policy.module.css";

export function OnboardingPrivacyPolicy(): ReactNode {
  const { next, back } = useContext(OnboardingContext);
  const [accept, setAccept] = useState<boolean>(false);
  return (
    <div className={clsx("flex col gap40", styles.container)}>
      <h6>Swash Privacy Policy</h6>
      <div className={"round no-overflow flex col gap32 bg-white card32"}>
        <p>
          Check out the{" "}
          <a href={WEBSITE_URLs.terms} target={"_blank"} rel={"noreferrer"}>
            Terms of Service
          </a>{" "}
          so you know what to expect when using Swash.
          <br />
          <br />
          Swash works by capturing your data to then sell it on your behalf,
          ensuring you receive your share of the value it generates. The type of
          data Swash collects includes clickstream, search, and some personal
          data. You can find the full list of data points in the{" "}
          <a href={WEBSITE_URLs.privacy} target={"_blank"} rel={"noreferrer"}>
            Privacy Policy
          </a>
          .
          <br />
          <br />
          You can always visit the Privacy Policy and Terms of Service through
          the Help section in the app or through the Swash website.
        </p>
        <Checkbox
          checked={accept}
          onChange={() => {
            setAccept(!accept);
          }}
          label={
            <p className={"small"}>
              I have read the Policy and Terms of Service and I agree.
            </p>
          }
        />
        <NavigationButtons
          onBack={() => back()}
          onNext={() => (accept ? next() : undefined)}
          disableNext={!accept}
        />
      </div>
    </div>
  );
}
