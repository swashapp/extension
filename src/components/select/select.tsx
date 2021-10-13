import { makeStyles, MenuItem } from '@material-ui/core';
import MuiSelect from '@material-ui/core/Select';
import React, { memo } from 'react';
import { PropsWithChildren } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
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

export default memo(function Select(
  props: PropsWithChildren<{
    items: { value: string; description: string }[];
    label: string;
    value: string | number;
    onChange?: (
      event: React.ChangeEvent<{ name?: string; value: unknown }>,
    ) => void;
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
        MenuProps={{
          disableScrollLock: true,
        }}
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
});
