import React from 'react';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';

export default function Popup(props: DialogProps) {
  return props.open ? (
    <Dialog className="popup" {...props}>
      <div className="popup-content">{props.children}</div>
    </Dialog>
  ) : (
    <></>
  );
}
