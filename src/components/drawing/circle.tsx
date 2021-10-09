import React from 'react';
import { memo } from 'react';

export default memo(function Circle(props: {
  color?:
    | 'black'
    | 'white'
    | 'dark-blue'
    | 'light-blue'
    | 'lightest-green'
    | 'light-green';
  border?: 'black' | 'white' | 'gray';
  dashed?: string;
  colorful?: boolean;
  colorfulGradiant?: boolean;
  className?: string;
}) {
  const color = props.color ? `var(--${props.color})` : 'transparent';
  const border = props.border ? `var(--${props.border})` : 'transparent';
  const dashed = props.dashed || '0';
  return (
    <div
      className={`${props.className} ${'circle-container'} ${
        props.colorful ? 'circle-colorful' : ''
      } ${props.colorfulGradiant ? 'circle-colorful-gradiant' : ''}`}
    >
      <svg
        width={'100%'}
        height={'100%'}
        alignmentBaseline={'central'}
        overflow={'visible'}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx={'50%'}
          cy={'50%'}
          r={'50%'}
          stroke={border}
          strokeWidth={1}
          strokeDasharray={dashed}
          fill={color}
        />
      </svg>
    </div>
  );
});
