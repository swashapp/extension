import { Dispatch, ReactElement, SetStateAction } from 'react';

import { Checkbox } from '../checkbox/checkbox';

import '../../static/css/components/accept-checkbox.css';

export function AcceptCheckBox(props: {
  value: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
  text?: ReactElement;
}): ReactElement {
  return (
    <div className={'flex row align-center'}>
      <Checkbox
        checked={props.value}
        onChange={() => props.setValue((a) => !a)}
      />
      <div
        onClick={() => props.setValue((a) => !a)}
        className={'accept-checkbox-text'}
      >
        <p>{props.text ? props.text : <>I have read it and I agree</>}</p>
      </div>
    </div>
  );
}
