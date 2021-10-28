import React from 'react';

const removeIcon = '/static/images/shape/remove.svg';

export function RemoveButton(props: { onClick: () => void }): JSX.Element {
  return (
    <div onClick={props.onClick} className="remove-button">
      <div className="remove-icon">
        <img width={16} height={16} src={removeIcon} alt={'-'} />
      </div>
      <div className="remove-text">Remove</div>
    </div>
  );
}
