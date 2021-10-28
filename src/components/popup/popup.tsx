import Dialog from '@material-ui/core/Dialog';
import React, { ReactElement, useEffect } from 'react';

import { ClosablePanel } from '../closable-panel/closable-panel';

export interface popupProps {
  content: ReactElement | null;
  closable: boolean;
  closeOnBackDropClick?: boolean;
}

let _item: popupProps = { content: null, closable: false };
let _callback: () => void = () => undefined;

export function showPopup(props: popupProps): void {
  _item = props;
  _callback();
}

export function closePopup(): void {
  _item = { content: null, closable: false };
  _callback();
}

function Modal(props: {
  content: ReactElement | null;
  closeOnBackDropClick?: boolean;
}) {
  return (
    <Dialog
      {...props}
      maxWidth={false}
      open={true}
      onBackdropClick={
        props.closeOnBackDropClick ? () => closePopup() : () => undefined
      }
      className="popup"
      BackdropProps={{ style: { background: 'rgba(0, 32, 48, 0.7)' } }}
      PaperProps={{ className: 'popup-paper' }}
    >
      <div className="popup-content">{props.content || <></>}</div>
    </Dialog>
  );
}

function ClosablePopup(props: { content: ReactElement }) {
  return (
    <Modal
      content={
        <ClosablePanel className="closable-popup" onClose={() => closePopup()}>
          {props.content}
        </ClosablePanel>
      }
    />
  );
}
export function Popup(): JSX.Element {
  const [openDialog, setOpenedDialog] = React.useState<popupProps>(_item);
  useEffect(() => {
    _callback = () => {
      setOpenedDialog(_item);
    };
  }, []);
  return openDialog.content ? (
    openDialog.closable ? (
      <ClosablePopup content={openDialog.content} />
    ) : (
      <Modal
        content={openDialog.content}
        closeOnBackDropClick={openDialog.closeOnBackDropClick}
      />
    )
  ) : (
    <></>
  );
}
