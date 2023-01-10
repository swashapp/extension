import React, { useState } from 'react';

import { helper } from '../../core/webHelper';
import { Button } from '../button/button';
import { Input } from '../input/input';
import { closePopup } from '../popup/popup';

export function AddSite(props: {
  rank: number;
  onSave: () => void;
}): JSX.Element {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  return (
    <>
      <div className="popup-title title">Add site</div>
      <div className="popup-separator" />
      <div className="popup-content">
        <Input
          label="Title"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <Input
          label="URL"
          name="url"
          value={url}
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
            const _url = new URL(url);
            helper
              .addSite(props.rank, title, url, `${_url.origin}/favicon.ico`)
              .then(() => {
                props.onSave();
                closePopup();
              });
          }}
        />
      </div>
    </>
  );
}
