import React, { useState } from 'react';

import { toast } from 'react-toastify';

import { helper } from '../../core/webHelper';
import { Button } from '../button/button';
import { Input } from '../input/input';
import { closePopup } from '../popup/popup';
import { ToastMessage } from '../toast/toast-message';

export function AddSite(props: {
  rank: number;
  onSave: () => void;
}): JSX.Element {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('https://');
  return (
    <>
      <div className="popup-title title">Add site</div>
      <div className="popup-separator" />
      <div className="popup-content">
        <Input
          label="Title"
          name="title"
          value={title}
          autoComplete={'off'}
          onChange={(event) => setTitle(event.target.value)}
        />
        <Input
          label="URL"
          name="url"
          value={url}
          autoComplete={'off'}
          placeholder={'https://'}
          onChange={(event) => setUrl(event.target.value)}
        />
      </div>
      <div className="popup-separator" />
      <div className="popup-actions">
        <Button
          text={'Cancel'}
          color={'secondary'}
          className="popup-actions-cancel"
          link={false}
          onClick={() => {
            closePopup();
          }}
        />
        <Button
          text={'Add'}
          className="popup-actions-submit"
          link={false}
          onClick={() => {
            try {
              const _url = new URL(url);
              helper
                .addSite(props.rank, title, url, `${_url.origin}/favicon.ico`)
                .then(() => {
                  props.onSave();
                  closePopup();
                });
            } catch (err) {
              toast(
                <ToastMessage
                  type="error"
                  content={<>Invalid url, please use the right format</>}
                />,
              );
            }
          }}
        />
      </div>
    </>
  );
}
