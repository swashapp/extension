import React, { memo, useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import FileBrowser from 'react-keyed-file-browser';

import Button from '../button/button';

interface FILE {
  key: string;
  id: string;
}
export default memo(function FilePicker(props: {
  onboarding: string;
  applyConfig: (selectedFile: FILE | undefined, onboarding: string) => void;
}) {
  const [files, setFiles] = useState<FILE[]>([]);
  const [selectedFile, setSelectedFile] = useState<FILE>();
  useEffect(() => {
    const _files: FILE[] = [];
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
  }, [props.onboarding]);

  return (
    <div className="passphrase-container">
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
          onClick={() => props.applyConfig(selectedFile, props.onboarding)}
          disabled={!selectedFile}
          text="Import"
        />
      </div>
    </div>
  );
});
