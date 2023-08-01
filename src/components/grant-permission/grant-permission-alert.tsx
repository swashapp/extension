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
        Swash extension needs some mandatory permissions to works normally.
        Please click on the following button to open the grant permission popup.
        By clicking on allow you will be able to continue using Swash extension.
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
