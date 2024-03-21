import { ReactElement, useCallback, useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import { helper } from '../../core/webHelper';
import { Button } from '../button/button';
import { ShowEndAdornment } from '../input/end-adornments/show-end-adornment';
import { Input } from '../input/input';
import { closePopup } from '../popup/popup';
import { ToastMessage } from '../toast/toast-message';

export function ImportPrivateKey(props: {
  onBeforeImport: () => void;
  onImport: () => void;
  onImportFailed: () => void;
}): ReactElement {
  const [reveal, setReveal] = useState<boolean>(false);
  const [privateKey, setPrivateKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const applyConfig = useCallback(() => {
    if (/^0x[A-F0-9]{64}$/i.test(privateKey)) {
      setLoading(true);
      props.onBeforeImport();
      setLoading(false);
      helper
        .importAndSaveWallet(privateKey)
        .then(() => {
          closePopup();
          props.onImport();
        })
        .catch(() => {
          props.onImportFailed;
        });
    } else
      toast(
        <ToastMessage
          type={'error'}
          content={<>Invalid private key format</>}
        />,
      );
  }, [privateKey, props]);

  return (
    <div className={'card'}>
      <h6>Private Key</h6>
      Please enter your private key in the input below
      <Input
        label={'Private key'}
        value={privateKey}
        type={reveal ? 'text' : 'password'}
        onChange={(e) => setPrivateKey(e.target.value)}
        endAdornment={
          <ShowEndAdornment
            show={reveal}
            onClick={() => {
              setReveal(!reveal);
            }}
          />
        }
      />
      <Button
        link={false}
        onClick={applyConfig}
        loading={loading}
        text="Import"
      />
    </div>
  );
}
