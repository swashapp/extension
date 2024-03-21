import { ReactElement, SyntheticEvent } from 'react';

import '../../static/css/components/remove-button.css';

const removeIcon = '/static/images/shape/remove.svg';

export function RemoveButton(props: {
  onClick: (e: SyntheticEvent) => void;
}): ReactElement {
  return (
    <div
      onClick={props.onClick}
      className={'flex row align-center remove-button'}
    >
      <div className={'remove-icon'}>
        <img width={16} height={16} src={removeIcon} alt={'-'} />
      </div>
      <p className={'small remove-text'}>Remove</p>
    </div>
  );
}
