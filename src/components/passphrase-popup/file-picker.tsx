import React, { memo, useCallback, useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import FileBrowser from 'react-keyed-file-browser';

import { toast } from 'react-toastify';

import Button from '../button/button';
import { closePopup } from '../popup/popup';

import ToastMessage from '../toast/toast-message';

interface FILE {
  key: string;
  id: string;
}
export default memo(function FilePicker(props: {
  onboarding: string;
  onImport: () => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<FILE[]>([]);
  const [selectedFile, setSelectedFile] = useState<FILE>();
  useEffect(() => {
    const _files = files;
    if (props.onboarding === 'GoogleDrive' || props.onboarding === 'DropBox') {
      window.helper.getFilesList(props.onboarding).then((status) => {
        let fileList = [];

        if (props.onboarding === 'GoogleDrive') fileList = status.files;
        else if (props.onboarding === 'DropBox') fileList = status.entries;

        for (const fileIndex in fileList) {
          if (fileList[fileIndex]) {
            const file = fileList[fileIndex];

            const _file = {
              key: file.name,
              id: file.id,
            };

            _files.push(_file);
          }
        }
        setFiles(_files);
      });
    }
  });

  const applyConfig = useCallback(() => {
    setLoading(true);
    if (selectedFile?.id)
      return window.helper
        .downloadFile(props.onboarding, selectedFile.id)
        .then((response) => {
          if (response) {
            return window.helper
              .applyConfig(JSON.stringify(response))
              .then((result) => {
                if (result) {
                  setLoading(false);
                  props.onImport();
                  closePopup();
                  toast(
                    <ToastMessage
                      type="success"
                      content={<>Config file is imported successfully</>}
                    />,
                  );
                } else {
                  setLoading(false);
                  toast(
                    <ToastMessage
                      type="error"
                      content={<>Can not import this config file</>}
                    />,
                  );
                }
              });
          }
        });
    else {
      closePopup();
    }
  }, [props, selectedFile?.id]);

  return (
    <div className="passphrase-container">
      <FileBrowser
        files={files}
        isSelectable={true}
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
