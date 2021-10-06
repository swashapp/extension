import React from 'react';
import { makeStyles, MenuItem } from '@material-ui/core';
import MuiSelect from '@material-ui/core/Select';
import { PropsWithChildren } from 'react';
import smallArrow from 'url:../../static/images/shape/small-arrow.svg';
import InputBase from '../input-base/input-base';
import Label from '../label/label';

const useStyles = makeStyles(() => ({
  icon: {
    top: '50%',
    color: 'rgba(0, 0, 0, 0.54)',
    right: 26,
    position: 'absolute',
    pointerEvents: 'visible',
  },
}));

export default function Select(
  props: PropsWithChildren<{
    items: { value: string; description: string }[];
    label: string;
    value: string | number;
    onChange?: (event: any) => void;
  }>,
) {
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
        input={<InputBase />}
      >
        {props.items.map((item, index) => (
          <MenuItem key={item.value + index} value={item.value}>
            <div className="flex-row">
              <div className="select-item-value">{item.value}</div>
              &nbsp;&nbsp;&nbsp;
              <div className="select-item-description">{item.description}</div>
            </div>
          </MenuItem>
        ))}
      </MuiSelect>
    </Label>
  );
}
