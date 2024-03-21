import { IconButton, InputAdornment } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { ReactElement } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';

import { ToastMessage } from '../../toast/toast-message';

const copyIcon = '/static/images/shape/copy.svg';

const useStyles = makeStyles(() => ({
  icon: {
    top: '50%',
    right: 14,
    position: 'absolute',
  },
}));

export function CopyEndAdornment(props: { value: string }): ReactElement {
  const classes = useStyles();
  return (
    <InputAdornment className={classes.icon} position={'end'}>
      <CopyToClipboard text={props.value}>
        <IconButton
          onClick={() =>
            toast(
              <ToastMessage
                type={'success'}
                content={<>Copied successfully</>}
              />,
            )
          }
          size={'large'}
        >
          <img src={copyIcon} alt={'copy'} />
        </IconButton>
      </CopyToClipboard>
    </InputAdornment>
  );
}
