import { withStyles } from '@material-ui/core';
import MuTooltip from '@material-ui/core/Tooltip';
import React, { ReactElement } from 'react';

const StyledTooltip = withStyles(() => ({
  tooltip: {
    position: 'relative',

    backgroundColor: '#E5F5FA',
    borderRadius: '15px',
    fontSize: '10px',
    lineHeight: '12px',
    boxShadow: '0 0 1px 1px rgba(0, 0, 0, 0.1)',

    color: '#8091A3',
    padding: '5px 10px',
    zIndex: 1,
  },
  tooltipPlacementRight: {
    margin: 0,
    bottom: 0,
    right: 0,
  },
}))(MuTooltip);

export function Tooltip(props: { text: string | ReactElement }): JSX.Element {
  return (
    <StyledTooltip
      title={props.text}
      PopperProps={{
        className: 'tooltip-popper',
        popperOptions: {
          modifiers: {
            flip: { enabled: false },
            offset: {
              enabled: true,
              offset: '-7px 0px 0px -10px',
            },
          },
        },
      }}
      placement="right-end"
    >
      <div className="tooltip-icon" />
    </StyledTooltip>
  );
}
