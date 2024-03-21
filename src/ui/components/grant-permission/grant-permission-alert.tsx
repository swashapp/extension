import { ReactNode, useCallback, useEffect } from "react";
import { permissions } from "webextension-polyfill";

import { Button } from "@/ui/components/button/button";
import { closePopup } from "@/ui/components/popup/popup";

const permissionsToRequest = {
  origins: ["<all_urls>"],
};

export function GrantPermissionAlert(): ReactNode {
  const loadActivePermissions = useCallback(async () => {
    const { origins } = await permissions.getAll();
    if (origins?.includes(permissionsToRequest.origins[0])) closePopup();
  }, []);

  useEffect(() => {
    loadActivePermissions().then();
  }, [loadActivePermissions]);

  return (
    <>
      <p className={"large"}>Permission</p>
      <hr />
      <div className={"flex col gap12"}>
        For Swash to work properly, you should approve the additional
        permissions required. Click on the button below to open the permissions
        popup.
        <br />
        <br />
        Once you have clicked &apos;Allow&apos;, you will be able to continue
        using Swash.
      </div>
      <hr />
      <div className={"flex justify-center"}>
        <Button
          text={"Grant"}
          onClick={async () => {
            const response = await permissions.request(permissionsToRequest);
            if (response) closePopup();
          }}
        />
      </div>
    </>
  );
}
