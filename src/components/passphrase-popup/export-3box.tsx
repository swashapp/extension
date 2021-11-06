import * as bip39 from 'bip39';

import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '../button/button';
import { FormMessage } from '../form-message/form-message';
import { closePopup } from '../popup/popup';
import { ToastMessage } from '../toast/toast-message';

export function Export3Box(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [mnemonic, setMnemonic] = useState<string>('');
  const getMnemonic = useCallback(() => {
    window.helper.get3BoxMnemonic().then((_mnemonic: string) => {
      let passphrase = _mnemonic;
      if (!_mnemonic) {
        passphrase = bip39.generateMnemonic();
      }
      setMnemonic(passphrase);
    });
  }, []);
  useEffect(() => {
    if (!mnemonic) {
      getMnemonic();
    }
  }, [getMnemonic, mnemonic]);
  const backupConfig = useCallback(() => {
    setLoading(true);
    bip39.mnemonicToSeed(mnemonic).then((bytes) => {
      const seed = '0x'.concat(bytes.toString('hex').substring(0, 32));
      window.helper
        .writeTo3BoxSpace(seed)
        .then(() => {
          setLoading(false);
          toast(
            <ToastMessage
              type="success"
              content={<>The configuration file is exported successfully</>}
            />,
          );
          closePopup();
        })
        .catch((err?: { message: string }) => {
          setLoading(false);
          toast(
            <ToastMessage
              type="error"
              content={<>{err?.message || 'Something went wrong!'}</>}
            />,
          );
        });
    });
  }, [mnemonic]);

  return (
    <div className="passphrase-container">
      <p>
        If you ever change browsers or move computers, you will need this seed
        phrase to access your 3Box backups. Save them somewhere safe and secret.
        <br />
        <br />
      </p>
      <div className="passphrase-export-mnemonic">{mnemonic}</div>
      <br />
      <FormMessage
        type="warning"
        text="This feature is experimental and so may not work perfectly all the time. It may change or be removed in the future. Use it at your own risk."
      />
      <div className="form-button passphrase-button">
        <Button
          link={false}
          onClick={backupConfig}
          disabled={!mnemonic}
          loading={loading}
          loadingText="Uploading"
          text="Export"
        />
      </div>
    </div>
  );
}
