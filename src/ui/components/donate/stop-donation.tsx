import { ReactNode, useState } from "react";

import { ButtonColors } from "@/enums/button.enum";
import { SystemMessage } from "@/enums/message.enum";
import { helper } from "@/helper";
import { GetCharityInfoRes } from "@/types/api/charity.type";
import { OngoingDonationRes } from "@/types/api/donation.type";
import { Button } from "@/ui/components/button/button";
import { closePopup } from "@/ui/components/popup/popup";
import { toastMessage } from "@/ui/components/toast/toast-message";
import { useAccountBalance } from "@/ui/hooks/use-account-balance";
import { useErrorHandler } from "@/ui/hooks/use-error-handler";

import styles from "./donate.module.css";

export function StopDonation({
  charity,
  ongoing,
  onStop,
}: {
  charity: GetCharityInfoRes;
  ongoing: OngoingDonationRes;
  onStop?: () => void;
}): ReactNode {
  const { safeRun } = useErrorHandler();
  const { balance } = useAccountBalance();

  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className={styles.popup}>
      <p className={"large"}>You sure you want to stop donating?</p>
      <hr />
      <div className={"flex col gap20"}>
        <div className={"flex justify-between"}>
          <p>Charity</p>
          <p>{charity.name}</p>
        </div>
        <div className={"flex justify-between"}>
          <p>Donation Type</p>
          <p>Ongoing Donation</p>
        </div>
        <div className={"flex justify-between"}>
          <p>Current Balance</p>
          <p>{balance} SWASH</p>
        </div>
        <div className={"flex justify-between"}>
          <p>Amount to Donate</p>
          <p>{ongoing.portion}%/day</p>
        </div>
      </div>
      <hr />
      <div className={"flex justify-between"}>
        <Button
          text={"Cancel"}
          color={ButtonColors.SECONDARY}
          onClick={() => {
            closePopup();
          }}
        />
        <Button
          text={"Confirm"}
          loading={loading}
          onClick={async () => {
            setLoading(true);
            safeRun(
              async () => {
                await helper("user").removeOngoingDonation(ongoing.id);
                if (onStop) onStop();
                toastMessage(
                  "success",
                  SystemMessage.SUCCESSFULLY_STOP_ONGOING_DONATION,
                );
                closePopup();
              },
              {
                finally: () => {
                  setLoading(false);
                },
              },
            );
          }}
        />
      </div>
    </div>
  );
}
