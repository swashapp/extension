import { ReactNode, useCallback, useEffect, useState } from 'react';

import { helper } from '../../../helper';
import { Switch } from '../switch/switch';

import '../../../static/css/components/toggle.css';

export function Toggle(): ReactNode {
  const [status, setStatus] = useState<boolean>(false);

  const onStatusChanged = useCallback(async (checked: boolean) => {
    await helper('coordinator').set('isActive', checked);
    setStatus(checked);
  }, []);

  useEffect(() => {
    helper('coordinator')
      .get('isActive')
      .then((value) => {
        setStatus(value as boolean);
      });
  }, []);

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
