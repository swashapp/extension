import { styled, Switch as MuiSwitch, SwitchProps } from '@mui/material';
import React from 'react';

const CustomSwitch = styled((props: SwitchProps & { invert: boolean }) => {
  const _props = { ...props } as Partial<SwitchProps & { invert: boolean }>;
  delete _props.invert;

  return (
    <MuiSwitch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {..._props}
    />
  );
})(({ theme, invert }) => ({
  width: 32,
  height: 20,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 16,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: 'var(--white)',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: invert ? 'var(--light-green)' : 'var(--gray)',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 16,
    height: 16,
    borderRadius: 9,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 12,
    opacity: 1,
    backgroundColor: invert ? 'var(--gray)' : 'var(--light-green)',
    boxSizing: 'border-box',
  },
}));

export function Switch(props: SwitchProps & { invert?: boolean }): JSX.Element {
  const invert = props.invert ? props.invert : false;
  return <CustomSwitch {...props} invert={invert} />;
}
