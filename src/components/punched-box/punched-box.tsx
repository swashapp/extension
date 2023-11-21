import React, { PropsWithChildren } from 'react';

export function PunchedBox(
  props: PropsWithChildren<{ className: string; punchClassName: string }>,
): JSX.Element {
  const { className, punchClassName } = props;

  return (
    <div className={`punched-container ${className}`}>
      <span className={`punched-circle top ${punchClassName}`} />
      <span className={`punched-circle right ${punchClassName}`} />
      <span className={`punched-circle bottom ${punchClassName}`} />
      <span className={`punched-circle left ${punchClassName}`} />
      <div className="punched-box">{props.children}</div>
    </div>
  );
}
