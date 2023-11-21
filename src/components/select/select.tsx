import {
  Select as MuiSelect,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { PropsWithChildren } from 'react';

import { InputBase } from '../input-base/input-base';
import { Label } from '../label/label';

const smallArrow = '/static/images/shape/small-arrow.svg';

const useStyles = makeStyles(() => ({
  icon: {
    top: '50%',
    color: 'rgba(0, 0, 0, 0.54)',
    right: 26,
    position: 'absolute',
    pointerEvents: 'visible',
  },
}));

export function Select(
  props: PropsWithChildren<{
    items: { name: string; value: string }[];
    label: string;
    value: string | number;
    onChange?: (
      event: SelectChangeEvent<{ name?: string; value: unknown }>,
    ) => void;
    disabled?: boolean;
  }>,
): JSX.Element {
  const classes = useStyles();
  return (
    <Label id={'customized-select-' + props.value} text={props.label}>
      <MuiSelect
        displayEmpty={true}
        IconComponent={() =>
          props.disabled ? (
            <></>
          ) : (
            <img className={classes.icon} src={smallArrow} alt={'>'} />
          )
        }
        className={'select'}
        id={'customized-select-' + props.value}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        value={props.value}
        onChange={props.onChange}
        MenuProps={{
          disableScrollLock: true,
          PaperProps: {
            sx: {
              borderRadius: '12px',
              marginTop: '8px',
            },
          },
          classes: {
            paper: 'select-paper',
          },
        }}
        disabled={props.disabled}
        input={<InputBase />}
      >
        {props.items.map((item, index) => (
          <MenuItem key={item.value + index} value={item.value}>
            <div className="flex-row">
              <div className="select-item-value">{item.name}</div>
            </div>
          </MenuItem>
        ))}
      </MuiSelect>
    </Label>
  );
}
