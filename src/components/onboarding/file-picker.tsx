import React, { useCallback, useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import FileBrowser from 'react-keyed-file-browser';

import { Button } from '../button/button';
import { closePopup } from '../popup/popup';

interface FILE {
  key: string;
  id: string;
}
export function FilePicker(props: {
  onboarding: string;
  onBeforeImport: () => void;
  onImport: () => void;
  onImportFailed: () => void;
}): JSX.Element {
  const [files, setFiles] = useState<FILE[]>([]);
  const [selectedFile, setSelectedFile] = useState<FILE>();
  const [loading, setLoading] = useState<boolean>(false);

  const applyConfig = useCallback(() => {
    if (selectedFile?.id) {
      setLoading(true);
      return window.helper
        .downloadFile(props.onboarding, selectedFile.id)
        .then((response: any) => {
          if (response) {
            props.onBeforeImport();
            setLoading(false);
            closePopup();
            return window.helper
              .applyConfig(JSON.stringify(response))
              .then((result: any) => {
                if (result) {
                  props.onImport();
                } else {
                  props.onImportFailed();
                }
              });
          }
        });
    } else {
      closePopup();
    }
  }, [props, selectedFile?.id]);

  useEffect(() => {
    const _files: FILE[] = [];
    if (props.onboarding === 'GoogleDrive' || props.onboarding === 'DropBox') {
      window.helper
        .getFilesList(props.onboarding)
        .then((status: { files: any[]; entries: any[] }) => {
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
  }, [props.onboarding]);

  return (
    <div>
      <h5>Select a file</h5>
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
          loading={loading}
          disabled={!selectedFile}
          text="Import"
        />
      </div>
    </div>
  );
}
