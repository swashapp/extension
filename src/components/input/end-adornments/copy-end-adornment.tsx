import { IconButton, InputAdornment, makeStyles } from '@material-ui/core';
import React, { memo } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import copyIcon from 'url:../../../static/images/shape/copy.svg';

const useStyles = makeStyles(() => ({
  icon: {
    top: '50%',
    right: 14,
    position: 'absolute',
  },
}));

export default memo(function CopyEndAdornment(props: { value: string }) {
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
});
