import { ReactElement, useCallback, useEffect, useState } from 'react';

import { helper } from '../../core/webHelper';
import { Switch } from '../switch/switch';

import '../../static/css/components/toggle.css';

export function Toggle(): ReactElement {
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
    <div className={'flex center gap8'}>
      <p className={'smaller bold extension-popup-switch-label'}>
        {status ? 'ON' : 'OFF'}
      </p>
      <Switch
        checked={status}
        onChange={(e) => onStatusChanged(e.target.checked)}
      />
    </div>
  );
}
