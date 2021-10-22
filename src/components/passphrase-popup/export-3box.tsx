import bip39 from 'bip39';

import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '../button/button';
import { FormMessage } from '../form-message/form-message';
import { closePopup } from '../popup/popup';

export function Export3Box(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [mnemonic, setMnemonic] = useState<string>('');
  const getMnemonic = useCallback(() => {
    window.helper.get3BoxMnemonic().then((_mnemonic) => {
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
        .then(() => closePopup())
        .finally(() => setLoading(false));
    });
  }, [mnemonic]);

  return (
    <div className="passphrase-container">
      <p>
        If you ever change browsers or move computers, you will need this seed
        phrase to access your 3Box backups. Save them somewhere safe and secret.
        <br />
        <br />
        <div className="passphrase-export-mnemonic">{mnemonic}</div>
        <br />
      </p>
      <FormMessage
        type="warning"
        text="This feature is experimental and so may not work perfectly all the time. It may change or be removed in the future. Use it at your own risk."
      />
      <div className="form-button passphrase-button">
        <Button
          link={false}
          onClick={backupConfig}
          loading={loading}
          loadingText="Uploading"
          text="Export"
        />
      </div>
    </div>
  );
}
