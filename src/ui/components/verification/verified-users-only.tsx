import { ReactNode } from "react";

import { ButtonColors } from "@/enums/button.enum";
import { InternalRoutes } from "@/paths";
import { Button } from "@/ui/components/button/button";
import { closePopup } from "@/ui/components/popup/popup";

export function VerifiedUsersOnly(props: {
  header: string;
  body: ReactNode;
}): ReactNode {
  return (
    <>
      <p className={"large"}>{props.header}</p>
      <hr />
      <p className={"flex col gap12"}>{props.body}</p>
      <hr />
      <div className={"flex justify-between"}>
        <Button
          text={"Cancel"}
          color={ButtonColors.SECONDARY}
          link={{ url: InternalRoutes.earnMore }}
          onClick={() => {
            closePopup();
          }}
        />
        <Button
          text={"Verify"}
          link={{ url: InternalRoutes.profile }}
          onClick={() => {
            closePopup();
          }}
        />
      </div>
    </>
  );
}
