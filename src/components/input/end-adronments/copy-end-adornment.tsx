import React from 'react';
import { IconButton, InputAdornment, makeStyles } from '@material-ui/core';

import copyIcon from 'url:../../../static/images/shape/copy.svg';

import { CopyToClipboard } from 'react-copy-to-clipboard';

const useStyles = makeStyles(() => ({
  icon: {
    top: '50%',
    right: 14,
    position: 'absolute',
  },
}));

export default function CopyEndAdornment(props: { value: string }) {
  const classes = useStyles();
  return (
    <InputAdornment className={classes.icon} position="end">
      <CopyToClipboard text={props.value}>
        <IconButton>
          <img src={copyIcon} alt={'copy'} />
        </IconButton>
      </CopyToClipboard>
    </InputAdornment>
  );
}
