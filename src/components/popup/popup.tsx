import React from 'react';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';

export default function Popup(props: DialogProps) {
  return props.open ? (
    <Dialog
      className="popup"
      BackdropProps={{ style: { background: 'rgba(0, 32, 48, 0.7)' } }}
      {...props}
    >
      <div className="popup-content">{props.children}</div>
    </Dialog>
  ) : (
    <></>
  );
}
