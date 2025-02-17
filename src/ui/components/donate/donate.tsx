import { Button as MuiButton } from "@mui/material";
import clsx from "clsx";
import { ReactNode, useCallback, useRef, useState } from "react";

import { ButtonColors } from "@/enums/button.enum";
import { SystemMessage } from "@/enums/message.enum";
import { helper } from "@/helper";
import { GetCharityInfoRes } from "@/types/api/charity.type";
import { OngoingDonationRes } from "@/types/api/donation.type";
import { MultiPageRef } from "@/types/ui.type";
import { Button } from "@/ui/components/button/button";
import { Input } from "@/ui/components/input/input";
import { NumericInput } from "@/ui/components/input/numeric-input";
import { MultiPageView } from "@/ui/components/multi-page-view/multi-page-view";
import { closePopup } from "@/ui/components/popup/popup";
import { Switch } from "@/ui/components/switch/switch";
import { toastMessage } from "@/ui/components/toast/toast-message";
import { useAccountBalance } from "@/ui/hooks/use-account-balance";
import { useErrorHandler } from "@/ui/hooks/use-error-handler";
import BackIcon from "~/images/icons/arrow-2.svg?react";

import styles from "./donate.module.css";

function Options({
  amount,
  selected,
  onClick,
}: {
  amount: number;
  selected: boolean;
  onClick: (value: number) => void;
}): ReactNode {
  return (
    <MuiButton
      variant={"outlined"}
      className={clsx("bg-white", styles.percent, {
        [styles.selected]: selected,
      })}
      onClick={() => {
        onClick(amount);
      }}
    >
      <span className={"flex align-center gap12"}>
        <span className={styles.number}>{amount}%</span>
        <span className={styles.daily}>per day</span>
      </span>
    </MuiButton>
  );
}

export function Donate({
  charity,
  onDonate,
}: {
  charity: GetCharityInfoRes;
  onDonate?: (ongoing: OngoingDonationRes) => void;
}): ReactNode {
  const ref = useRef<MultiPageRef>();

  const { safeRun } = useErrorHandler();
  const { balance } = useAccountBalance();

  const [loading, setLoading] = useState<boolean>(false);
  const [isOngoing, setIsOngoing] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [percent, setPercent] = useState<number>(25);

  const donate = useCallback(() => {
    safeRun(
      async () => {
        setLoading(true);
        if (isOngoing) {
          const ongoing = await helper("user").addOngoingDonation(
            charity.id,
            percent,
          );
          if (onDonate) onDonate(ongoing);
        } else {
          await helper("payment").donate(charity.wallet, amount);
          toastMessage(
            "success",
            SystemMessage.SUCCESSFULLY_ADDED_ONGOING_DONATION,
          );
        }
        ref.current?.next();
      },
      {
        finally: () => {
          setLoading(false);
        },
      },
    );
  }, [safeRun, isOngoing, charity, percent, onDonate, amount]);

  return (
    <MultiPageView ref={ref}>
      <div key={"form"} className={clsx("no-overflow", styles.popup)}>
        <p className={"large"}>
          <p className={"large bold"}>{charity.name}</p>
        </p>
        <hr />
        <div className={clsx("flex align-center justify-between", styles.type)}>
          <div
            className={clsx("flex align-center", {
              [styles.disabled]: isOngoing,
            })}
          >
            One-off Donation
          </div>
          <Switch
            checked={isOngoing}
            onChange={(_event, checked) => {
              setIsOngoing(checked);
            }}
          />
          <div
            className={clsx("flex align-center", {
              [styles.disabled]: !isOngoing,
            })}
          >
            Ongoing Donation
          </div>
        </div>
        <div className={styles.item}>
          <Input
            label={"Available Balance"}
            name={"balance"}
            value={balance}
            disabled={true}
          />
        </div>
        {isOngoing ? (
          <div className={styles.item}>
            Please select what percentage of your earnings you would like to
            donate every day. You can cancel your donation at any time.
            <div className={styles.option}>
              <div className={"flex row wrap gap16"}>
                <Options
                  amount={25}
                  onClick={setPercent}
                  selected={percent === 25}
                />
                <Options
                  amount={50}
                  onClick={setPercent}
                  selected={percent === 50}
                />
                <Options
                  amount={75}
                  onClick={setPercent}
                  selected={percent === 75}
                />
                <Options
                  amount={100}
                  onClick={setPercent}
                  selected={percent === 100}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.option}>
            <NumericInput
              label={"Donation Amount"}
              name={"amount"}
              value={amount}
              inputProps={{
                step: 0.25,
                min: 1,
                max: balance,
              }}
              autoFocus={true}
              setValue={(value) => {
                if (value >= 0 && value <= balance) setAmount(value);
                else if (value < 0) setAmount(0);
                else setAmount(balance);
              }}
              error={amount < 0 || amount > balance}
            />
          </div>
        )}
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
            text={"Next"}
            disabled={
              (!isOngoing && +amount === 0) ||
              (isOngoing && percent === 0) ||
              isNaN(balance)
            }
            onClick={() => ref.current?.next()}
          />
        </div>
      </div>
      <div key={"confirm"} className={clsx("no-overflow", styles.popup)}>
        <p className={"large"}>
          <div className={"flex align-center gap12"}>
            <BackIcon
              className={clsx("flex center pointer rotate270", styles.back)}
              onClick={() => ref.current?.back()}
            />
            <p className={"large bold"}>Confirmation</p>
          </div>
        </p>
        <hr />
        <div className={"flex col gap20"}>
          <div className={"flex justify-between"}>
            <p>Charity</p>
            <p>{charity.name}</p>
          </div>
          <div className={"flex justify-between"}>
            <p>Donation Type</p>
            <p>{isOngoing ? "Ongoing Donation" : "One-off Donation"}</p>
          </div>
          <div className={"flex justify-between"}>
            <p>Available Balance</p>
            <p>{balance} SWASH</p>
          </div>
          <div className={"flex justify-between"}>
            <p>Donation Amount</p>
            <p>{isOngoing ? `${percent}% per day` : `${amount} SWASH`}</p>
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
            onClick={() => {
              donate();
            }}
          />
        </div>
      </div>
      <div
        key={"thanks"}
        className={clsx(
          "flex col align-center gap24 no-overflow",
          styles.popup,
        )}
      >
        <img className={"charity-logo"} src={charity.logo} alt={charity.name} />
        <div className={"flex col gap4"}>
          <p className={"large bold text-center"}>Thank you!</p>
          <p className={"text-center"}>
            Thank you for your donation to {charity.name}! Manage your donations
            anytime on the Donation page.
          </p>
        </div>
      </div>
    </MultiPageView>
  );
}
