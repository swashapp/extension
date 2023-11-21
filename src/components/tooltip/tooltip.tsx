import {
  styled,
  Tooltip as MuiTooltip,
  tooltipClasses,
  TooltipProps,
} from '@mui/material';
import React, { ReactElement } from 'react';

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <MuiTooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    position: 'relative',

    backgroundColor: 'var(--color-soft-green)',
    borderRadius: '15px',
    fontFamily: 'var(--font-body-name)',
    fontWeight: 500,
    fontSize: '9px',
    lineHeight: '10px',
    border: '1px solid var(--color-jet-black)',
    color: 'var(--color-jet-black)',
    padding: '5px 10px',
    zIndex: 1,
  },
  [`& .${tooltipClasses.tooltipPlacementRight}`]: {
    margin: 0,
    bottom: 0,
    right: 0,
  },
}));

export function Tooltip(props: { text: string | ReactElement }): JSX.Element {
  return (
    <StyledTooltip
      title={props.text}
      PopperProps={{
        className: 'tooltip-popper',
        popperOptions: {
          modifiers: [
            { name: 'flip', options: { enabled: false } },
            {
              name: 'offset',
              options: { enabled: true, offset: [-7, 0, 0, -10] },
            },
          ],
        },
      }}
      placement="right-end"
    >
      <div className="tooltip-icon" />
    </StyledTooltip>
  );
}
