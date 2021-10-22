import bip39 from 'bip39';

import React, { memo, useCallback, useMemo, useState } from 'react';

import Button from '../button/button';
import FormMessage from '../form-message/form-message';
import Input from '../input/input';
import { showPopup } from '../popup/popup';

import Import3box from './import-3box';

export default memo(function SignIn3Box(props: { onImport: () => void }) {
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
      bip39.mnemonicToSeed(mnemonic).then((bytes) => {
        const seed = '0x'.concat(bytes.toString('hex').substring(0, 32));
        window.helper.getFrom3BoxSpace(seed).then((result) => {
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
              <Import3box
                files={files}
                mnemonic={mnemonic}
                onImport={props.onImport}
              />
            ),
          });
        });
      });
    }
  }, [isMnemonicValid, mnemonic, props.onImport]);

  return (
    <div className="passphrase-container">
      <p>
        If you ever change browsers or move computers, you will need this seed
        phrase to access your 3Box backups. Save them somewhere safe and secret.
        <br />
        <br />
        <Input
          name="mnemonic"
          value={mnemonic}
          multiline
          onChange={(e) => setMnemonic(e.target.value)}
        />
        <br />
      </p>
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
});
