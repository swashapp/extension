import React, { Dispatch, memo, SetStateAction } from 'react';

import Checkbox from '../checkbox/checkbox';

export default memo(function AcceptCheckBox(props: {
  value: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="flex-row accept-checkbox">
      <Checkbox
        checked={props.value}
        onChange={() => props.setValue((a) => !a)}
      />
      <div
        onClick={() => props.setValue((a) => !a)}
        className="accept-checkbox-text"
      >
        I have read it and I agree
      </div>
    </div>
  );
});
