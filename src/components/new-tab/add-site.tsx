import { ReactElement, useState } from 'react';

import { toast } from 'react-toastify';

import { helper } from '../../core/webHelper';
import { Button } from '../button/button';
import { Input } from '../input/input';
import { closePopup } from '../popup/popup';
import { ToastMessage } from '../toast/toast-message';

export function AddSite(props: {
  rank: number;
  onSave: () => void;
}): ReactElement {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('https://');
  return (
    <>
      <p className={'large'}>Add site</p>
      <hr />
      <div className={'flex col gap12'}>
        <Input
          label={'Title'}
          name={'title'}
          value={title}
          autoComplete={'off'}
          onChange={(event) => setTitle(event.target.value)}
        />
        <Input
          label={'URL'}
          name={'url'}
          value={url}
          autoComplete={'off'}
          placeholder={'https://'}
          onChange={(event) => setUrl(event.target.value)}
        />
      </div>
      <hr />
      <div className={'flex justify-between'}>
        <Button
          text={'Cancel'}
          color={'secondary'}
          className={'popup-cancel'}
          link={false}
          onClick={() => {
            closePopup();
          }}
        />
        <Button
          text={'Add'}
          className={'popup-submit'}
          link={false}
          onClick={() => {
            try {
              const _url = new URL(url);
              helper
                .addSite(
                  props.rank,
                  title,
                  url,
                  `https://www.google.com/s2/favicons?sz=64&domain_url=${_url.origin}`,
                )
                .then(() => {
                  props.onSave();
                  closePopup();
                });
            } catch (err) {
              toast(
                <ToastMessage
                  type={'error'}
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
