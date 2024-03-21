import { IconButton } from '@mui/material';
import { ReactNode } from 'react';

import CopyToClipboard from 'react-copy-to-clipboard';

import { SystemMessage } from '../../../enums/message.enum';

import { toastMessage } from '../toast/toast-message';
import { DarkModeToggle } from '../toggle/dark-mode-toggle';

export function PageHeader({
  header,
  uid,
}: {
  header: string;
  uid?: string;
}): ReactNode {
  return (
    <div className={'flex justify-between page-header'}>
      <h6>{header}</h6>
      <div className={'flex align-center gap40'}>
        {uid ? (
          <div className={'flex gap4 align-center page-header-uid'}>
            <p className={'small'}>Your UID: {uid}</p>
            <CopyToClipboard text={uid}>
              <IconButton
                size={'small'}
                onClick={() =>
                  toastMessage(
                    'success',
                    SystemMessage.SUCCESSFULLY_COPIED_WALLET_ADDRESS,
                  )
                }
              >
                <img src={'/static/images/shape/copy.svg'} alt={'copy'} />
              </IconButton>
            </CopyToClipboard>
          </div>
        ) : null}
        <DarkModeToggle />
      </div>
    </div>
  );
}
