import { IconButton, InputAdornment } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ReactNode } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { SystemMessage } from '../../../../enums/message.enum';
import { toastMessage } from '../../toast/toast-message';

const useStyles = makeStyles(() => ({
  icon: {
    height: 'auto',
    position: 'absolute',
    right: 14,
  },
}));

export function CopyEndAdornment({ value }: { value: string }): ReactNode {
  const classes = useStyles();
  return (
    <InputAdornment className={classes.icon} position={'end'}>
      <CopyToClipboard text={value}>
        <IconButton
          size={'large'}
          onClick={() =>
            toastMessage('success', SystemMessage.SUCCESSFULLY_COPIED)
          }
        >
          <img src={'/static/images/shape/copy.svg'} alt={'copy'} />
        </IconButton>
      </CopyToClipboard>
    </InputAdornment>
  );
}
