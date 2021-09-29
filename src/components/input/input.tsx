import React from 'react';
import { IconButton, InputAdornment, makeStyles } from '@material-ui/core';

import { PropsWithChildren } from 'react';

import InputBase from '../input-base/input-base';

import copyIcon from 'url:../../static/images/shape/copy.svg';
import Label from '../label/label';

import { CopyToClipboard } from 'react-copy-to-clipboard';

const useStyles = makeStyles(() => ({
  icon: {
    top: '50%',
    right: 14,
    color: '#8091A3',
    position: 'absolute',
  },
}));

export default function Input(
  props: PropsWithChildren<{
    value: string;
    onChange?: (e: { target: { value: string } }) => void;
    label: string;
    disabled?: boolean;
    copy?: boolean;
    password?: boolean;
    id: string;
  }>,
) {
  const classes = useStyles();
  return (
    <Label id={props.id} text={props.label}>
      <InputBase
        className={'input'}
        type={props.password ? 'password' : ''}
        endAdornment={
          props.copy ? (
            <InputAdornment className={classes.icon} position="end">
              <CopyToClipboard text={props.value}>
                <IconButton>
                  <img src={copyIcon} alt={'copy'} />
                </IconButton>
              </CopyToClipboard>
            </InputAdornment>
          ) : (
            <></>
          )
        }
        {...props}
      />
    </Label>
  );
}
