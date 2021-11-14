import React from 'react';

import Tour, { TOUR_NAME } from '../tour/tour';

export enum SETTINGS_TOUR_CLASS {
  BACKUP = 'backup',
  PRIVATE_KEY = 'private-key',
}

export function SettingsTour(): JSX.Element {
  return (
    <Tour
      tourName={TOUR_NAME.SETTINGS}
      steps={[
        {
          header: 'Backup your settings ⚙️',
          target: `.${SETTINGS_TOUR_CLASS.BACKUP}`,
          placement: 'right',
          content: (
            <>
              Wait! You need to backup your settings. Save this file in a safe
              place so you can import it later to keep your earnings safe.
            </>
          ),
        },
        {
          header: 'Private key 🔐',
          target: `.${SETTINGS_TOUR_CLASS.PRIVATE_KEY}`,
          placement: 'right',
          content: (
            <>
              This is your private key. Think of it like a password to your
              wallet. Remember, don’t share it!
            </>
          ),
        },
      ]}
    />
  );
}
