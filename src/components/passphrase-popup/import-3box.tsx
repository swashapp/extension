import React, { useCallback, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import FileBrowser from 'react-keyed-file-browser';

import { Button } from '../button/button';
import { closePopup } from '../popup/popup';

interface FILE {
  key: string;
  conf: File;
}
export function Import3Box(props: {
  files: FILE[];
  mnemonic: string;
  onBeforeImport: () => void;
  onImport: () => void;
  onImportFailed: () => void;
}): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<FILE>();
  const applyConfig = useCallback(() => {
    if (selectedFile) {
      setLoading(true);
      props.onBeforeImport();
      return window.helper
        .applyConfig(selectedFile.conf)
        .then((result: string) => {
          window.helper.save3BoxMnemonic(props.mnemonic).then(() => {
            setLoading(false);
            if (result) {
              props.onImport();
              closePopup();
            } else {
              props.onImportFailed();
            }
          });
        });
    }
  }, [props, selectedFile]);

  return (
    <div className="passphrase-container">
      <FileBrowser
        files={props.files}
        detailRenderer={() => {
          return <div />;
        }}
        onSelectFile={(file: FILE) => setSelectedFile(file)}
      />
      <div className="form-button passphrase-button">
        <Button
          link={false}
          onClick={applyConfig}
          disabled={!selectedFile}
          loading={loading}
          loadingText="Importing"
          text="Import"
        />
      </div>
    </div>
  );
}
