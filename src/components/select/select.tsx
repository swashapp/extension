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
    items: { value: string; description: string }[];
    label: string;
    value: { name?: string; value: string | number };
    onChange?: (
      event: SelectChangeEvent<{ name?: string; value: unknown }>,
    ) => void;
  }>,
): JSX.Element {
  const classes = useStyles();
  return (
    <Label id={'customized-select-' + props.value} text={props.label}>
      <MuiSelect
        displayEmpty={true}
        IconComponent={() => (
          <img className={classes.icon} src={smallArrow} alt={'>'} />
        )}
        className={'select'}
        id={'customized-select-' + props.value}
        value={props.value}
        onChange={props.onChange}
        MenuProps={{
          disableScrollLock: true,
        }}
        input={<InputBase />}
      >
        {props.items.map((item, index) => (
          <MenuItem key={item.value + index} value={item.value}>
            <div className="flex-row">
              <div className="select-item-value">{item.description}</div>
            </div>
          </MenuItem>
        ))}
      </MuiSelect>
    </Label>
  );
}
