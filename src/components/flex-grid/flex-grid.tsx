import React, { ReactElement } from 'react';
import { Children, PropsWithChildren } from 'react';

export function FlexGrid(
  props: PropsWithChildren<{
    column: number;
    children: ReactElement[];
    className?: string;
    innerClassName?: string;
  }>,
): JSX.Element {
  return (
    <div className={`flex-grid-container ${props.className}`}>
      {Children.map(props.children, (child, index) => {
        return props.innerClassName ? (
          <div key={`text-grid-${index}`} className={props?.innerClassName}>
            {child}
          </div>
        ) : (
          <div
            key={`text-grid-${index}`}
            style={{ width: `${100 / props.column}%` }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
}
