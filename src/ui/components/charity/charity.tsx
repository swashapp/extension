import clsx from "clsx";
import { ReactNode } from "react";

import { ButtonColors } from "@/enums/button.enum";
import { helper } from "@/helper";
import { GetCharityInfoRes } from "@/types/api/charity.type";
import { OngoingDonationRes } from "@/types/api/donation.type";
import { Button } from "@/ui/components/button/button";
import { FavButton } from "@/ui/components/button/fav";
import { Donate } from "@/ui/components/donate/donate";
import { StopDonation } from "@/ui/components/donate/stop-donation";
import { showPopup } from "@/ui/components/popup/popup";

import styles from "./charity.module.css";

export function Charity({
  charity,
  favorite,
  ongoing,
  className,
  onDonate,
  onStop,
}: {
  charity: GetCharityInfoRes;
  favorite: boolean;
  ongoing?: OngoingDonationRes;
  className?: string;
  onDonate?: (ongoing: OngoingDonationRes) => void;
  onStop?: () => void;
}): ReactNode {
  return (
    <div
      className={clsx(
        "round no-overflow bg-lightest-grey",
        styles.container,
        className,
      )}
    >
      <div className={clsx("relative", styles.banner)}>
        <img
          src={charity.banner}
          alt={""}
          style={{
            objectFit: "cover",
            width: "inherit",
            height: "inherit",
          }}
        />
        <img
          src={charity.logo}
          alt={charity.name}
          className={clsx("flex center no-overflow absolute", styles.logo)}
        />
      </div>
      <div
        className={clsx(
          "flex col justify-between border-box gap20",
          styles.body,
        )}
      >
        <div>
          <p className={"larger bold"}>{charity.name}</p>
          <p className={"small"}>{charity.location}</p>
        </div>
        <p>{charity.description}</p>
        <div className={clsx("flex align-center justify-between", styles.cta)}>
          <div className={clsx("flex align-center gap4", styles.actions)}>
            {ongoing ? (
              <Button
                text={"Stop Donating"}
                className={styles.action}
                color={ButtonColors.SECONDARY}
                onClick={() => {
                  showPopup({
                    closable: false,
                    closeOnBackDropClick: true,
                    size: "custom",
                    content: (
                      <StopDonation
                        charity={charity}
                        ongoing={ongoing}
                        onStop={onStop}
                      />
                    ),
                  });
                }}
              />
            ) : (
              <Button
                text={"Donate"}
                className={styles.action}
                onClick={() => {
                  showPopup({
                    closable: false,
                    closeOnBackDropClick: true,
                    size: "custom",
                    content: <Donate charity={charity} onDonate={onDonate} />,
                  });
                }}
              />
            )}
            <Button
              text={"Website"}
              className={styles.action}
              color={ButtonColors.SECONDARY}
              link={{ url: charity.website, newTab: true, external: true }}
            />
          </div>
          <FavButton
            enable={favorite}
            onClick={async (status: boolean) => {
              if (status)
                await helper("preferences").addCharityToFavorite(charity.id);
              else
                await helper("preferences").removeCharityToFavorite(charity.id);
            }}
          />
        </div>
      </div>
    </div>
  );
}
