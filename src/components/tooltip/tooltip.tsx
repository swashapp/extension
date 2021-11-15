import { withStyles } from '@material-ui/core';
import MuTooltip from '@material-ui/core/Tooltip';
import React, { ReactElement } from 'react';

const StyledTooltip = withStyles(() => ({
  tooltip: {
    position: 'relative',
    backgroundColor: '#C6E7F1',
    maxWidth: 300,
    border: '1px solid #C6E7F1',
    borderRadius: '20px',
    fontStyle: 'normal',
    fontSize: '10px',
    lineHeight: '10px',

    color: '#8091a3',
    padding: '10px',
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
              offset: '-8px 0px 0px -18px',
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
