import React, { memo, useCallback, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import FileBrowser from 'react-keyed-file-browser';

import { toast } from 'react-toastify';

import Button from '../button/button';
import { closePopup } from '../popup/popup';

import ToastMessage from '../toast/toast-message';

interface FILE {
  key: string;
  conf: File;
}
export default memo(function Import3Box(props: {
  files: FILE[];
  mnemonic: string;
  onImport: () => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<FILE>();
  const applyConfig = useCallback(() => {
    if (selectedFile) {
      setLoading(true);
      return window.helper.applyConfig(selectedFile.conf).then((result) => {
        window.helper
          .save3BoxMnemonic(props.mnemonic)
          .then(() => {
            if (result) {
              props.onImport();
              closePopup();
              toast(
                <ToastMessage
                  type="success"
                  content={<>Config file is imported successfully</>}
                />,
              );
            } else {
              toast(
                <ToastMessage
                  type="error"
                  content={<>Can not import this config file</>}
                />,
              );
            }
          })
          .finally(() => setLoading(false));
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
});
