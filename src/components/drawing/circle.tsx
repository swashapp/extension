import React from 'react';

export function Circle(props: {
  color?: 'black' | 'white' | 'green' | 'soft-green';
  border?: 'black' | 'white' | 'grey';
  dashed?: string;
  colorful?: boolean;
  colorfulGradient?: boolean;
  className?: string;
}): JSX.Element {
  const color = props.color ? `var(--color-${props.color})` : 'transparent';
  const border = props.border ? `var(--color-${props.border})` : 'transparent';
  const dashed = props.dashed || '0';
  return (
    <div
      className={`${props.className} ${'circle-container'} ${
        props.colorful ? 'circle-colorful' : ''
      } ${props.colorfulGradient ? 'circle-colorful-gradient' : ''}`}
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
}
