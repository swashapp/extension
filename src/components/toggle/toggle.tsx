import React, { useCallback, useEffect, useState } from 'react';

import { helper } from '../../core/webHelper';
import { Switch } from '../switch/switch';

export function Toggle(): JSX.Element {
  const [status, setStatus] = useState<boolean>(false);
  const onStatusChanged = useCallback((checked: boolean) => {
    if (checked) {
      helper.start();
    } else {
      helper.stop();
    }
    setStatus(checked);
  }, []);

  useEffect(
    () =>
      window.helper.isNeededOnBoarding().then((_needOnBoarding: boolean) => {
        if (!_needOnBoarding) {
          helper.load().then((db: { configs: { is_enabled: boolean } }) => {
            setStatus(db.configs.is_enabled);
          });
        }
      }),
    [],
  );

  return (
    <div className="flex-row extension-popup-switch">
      <div className="extension-popup-switch-label">
        {status ? 'ON' : 'OFF'}
      </div>
      <Switch
        checked={status}
        onChange={(e) => onStatusChanged(e.target.checked)}
      />
    </div>
  );
}
