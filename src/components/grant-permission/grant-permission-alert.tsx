import React, { useCallback, useEffect } from 'react';

import browser from 'webextension-polyfill';

import { Button } from '../button/button';
import { closePopup } from '../popup/popup';

const permissionsToRequest = {
  origins: ['<all_urls>'],
};

export function GrantPermissionAlert(): JSX.Element {
  const loadActivePermissions = useCallback(async () => {
    const { origins } = await browser.permissions.getAll();
    if (origins?.includes(permissionsToRequest.origins[0])) closePopup();
  }, []);

  useEffect(() => {
    loadActivePermissions().then();
  }, [loadActivePermissions]);

  return (
    <>
      <div className="small-popup-title title">Permission</div>
      <div className="small-popup-separator" />
      <div className="small-popup-content">
        For Swash to work properly, you should approve the additional
        permissions required. Click on the button below to open the permissions
        popup.
        <br />
        Once you have clicked &apos;Allow&apos;, you will be able to continue
        using Swash.
      </div>
      <div className="small-popup-separator" />
      <div className="small-popup-actions-center">
        <Button
          text={'Grant'}
          className="small-popup-actions-submit"
          link={false}
          onClick={async () => {
            const response = await browser.permissions.request(
              permissionsToRequest,
            );
            if (response) closePopup();
          }}
        />
      </div>
    </>
  );
}
