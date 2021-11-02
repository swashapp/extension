import * as bip39 from 'bip39';

import React, { useCallback, useMemo, useState } from 'react';

import { Button } from '../button/button';
import { FormMessage } from '../form-message/form-message';
import { Input } from '../input/input';
import { showPopup } from '../popup/popup';

import { Import3Box } from './import-3box';

export function SignIn3Box(props: {
  onBeforeImport: () => void;
  onImport: () => void;
  onImportFailed: () => void;
}): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [mnemonic, setMnemonic] = useState<string>('');

  const isMnemonicValid = useMemo(() => {
    let ret = false;
    if (mnemonic) ret = bip39.validateMnemonic(mnemonic);
    return ret;
  }, [mnemonic]);

  const signIn3Box = useCallback(() => {
    setLoading(true);
    if (isMnemonicValid) {
      bip39
        .mnemonicToSeed(mnemonic)
        .then((bytes) => {
          const seed = '0x'.concat(bytes.toString('hex').substring(0, 32));
          window.helper.getFrom3BoxSpace(seed).then((result: any) => {
            setLoading(false);
            const files = [];
            const fileList = JSON.parse(result);
            for (const fileIndex in fileList) {
              if (fileList[fileIndex]) {
                const file = {
                  key: fileIndex,
                  conf: fileList[fileIndex],
                };
                files.push(file);
              }
            }
            showPopup({
              closable: true,
              content: (
                <Import3Box
                  files={files}
                  mnemonic={mnemonic}
                  onBeforeImport={props.onBeforeImport}
                  onImport={props.onImport}
                  onImportFailed={props.onImportFailed}
                />
              ),
            });
          });
        })
        .catch(() => setLoading(false));
    }
  }, [
    isMnemonicValid,
    mnemonic,
    props.onBeforeImport,
    props.onImport,
    props.onImportFailed,
  ]);

  return (
    <div className="passphrase-container">
      <p>
        If you ever change browsers or move computers, you will need this seed
        phrase to access your 3Box backups. Save them somewhere safe and secret.
        <br />
      </p>
      <br />
      <Input
        label="Seed"
        name="mnemonic"
        value={mnemonic}
        multiline
        onChange={(e) => setMnemonic(e.target.value)}
      />
      <br />
      <br />
      <FormMessage
        type="warning"
        text="This feature is experimental and so may not work perfectly all the time. It may change or be removed in the future. Use it at your own risk."
      />
      <div className="form-button passphrase-button">
        <Button
          link={false}
          onClick={signIn3Box}
          disabled={!isMnemonicValid}
          loading={loading}
          loadingText="Signing"
          text="Sign In"
        />
      </div>
    </div>
  );
}
