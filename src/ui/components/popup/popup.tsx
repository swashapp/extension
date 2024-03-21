import { Backdrop, Dialog, styled } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';

import { ClosablePanel } from '../closable-panel/closable-panel';

const CustomBackdrop = styled(Backdrop)(() => ({
  background:
    'linear-gradient(119deg, rgba(0, 0, 0, 0.20) 2.66%, rgba(0, 0, 0, 0.20) 96.84%)',
  backdropFilter: 'blur(10px)',
}));

export interface popupProps {
  content: ReactNode | null;
  paperClassName?: string;
  closable: boolean;
  closeOnBackDropClick?: boolean;
  id?: string;
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
  content: ReactNode | null;
  closeOnBackDropClick?: boolean;
  paperClassName?: string;
  id?: string;
}) {
  return (
    <>
      <CustomBackdrop
        open={true}
        onClick={() => {
          if (props.closeOnBackDropClick) {
            closePopup();
          }
        }}
      />
      <Dialog
        id={props.id}
        maxWidth={false}
        open={true}
        onClose={(_event, reason) => {
          if (reason === 'backdropClick' && props.closeOnBackDropClick) {
            closePopup();
          }
        }}
        className={'popup'}
        PaperProps={{ className: `popup-paper ${props.paperClassName}` }}
      >
        <div className={'flex col gap12'}>{props.content || null}</div>
      </Dialog>
    </>
  );
}

function ClosablePopup(props: {
  content: ReactNode;
  closeOnBackDropClick?: boolean;
  paperClassName?: string;
  id?: string;
}) {
  return (
    <Modal
      {...props}
      content={
        <ClosablePanel
          className={'closable-popup'}
          onClose={() => closePopup()}
        >
          {props.content}
        </ClosablePanel>
      }
    />
  );
}
export function Popup(): ReactNode {
  const [openDialog, setOpenedDialog] = useState<popupProps>(_item);
  useEffect(() => {
    _callback = () => {
      setOpenedDialog(_item);
    };
  }, []);
  return openDialog.content ? (
    openDialog.closable ? (
      <ClosablePopup
        closeOnBackDropClick={openDialog.closeOnBackDropClick}
        paperClassName={openDialog.paperClassName}
        content={openDialog.content}
        id={openDialog.id}
      />
    ) : (
      <Modal
        content={openDialog.content}
        closeOnBackDropClick={openDialog.closeOnBackDropClick}
        paperClassName={openDialog.paperClassName}
        id={openDialog.id}
      />
    )
  ) : null;
}
