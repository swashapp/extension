import { IconButton, InputAdornment, makeStyles } from '@material-ui/core';
import React from 'react';
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

export function CopyEndAdornment(props: { value: string }): JSX.Element {
  const classes = useStyles();
  return (
    <InputAdornment className={classes.icon} position="end">
      <CopyToClipboard text={props.value}>
        <IconButton
          onClick={() =>
            toast(
              <ToastMessage
                type="success"
                content={<>Copied successfully</>}
              />,
            )
          }
        >
          <img src={copyIcon} alt={'copy'} />
        </IconButton>
      </CopyToClipboard>
    </InputAdornment>
  );
}
