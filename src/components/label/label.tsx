import { FormControl } from '@mui/material';
import { ReactElement } from 'react';
import { PropsWithChildren } from 'react';

import '../../static/css/components/label.css';

export function Label(
  props: PropsWithChildren<{
    id: string;
    children: ReactElement;
    text: string;
    shrink?: boolean | undefined;
  }>,
): ReactElement {
  return (
    <FormControl className={'label-form-control'}>
      <div className={'flex col gap4'}>
        <p className={'bold label-text'}>{props.text}</p>
        {props.children}
      </div>
    </FormControl>
  );
}
