import { Backdrop, Dialog, styled } from "@mui/material";
import clsx from "clsx";
import { ReactNode, useEffect, useState } from "react";

import { ClosablePanel } from "@/ui/components/closable-panel/closable-panel";

import styles from "./popup.module.css";

const CustomBackdrop = styled(Backdrop)(() => ({
  background:
    "linear-gradient(119deg, rgba(0, 0, 0, 0.20) 2.66%, rgba(0, 0, 0, 0.20) 96.84%)",
  backdropFilter: "blur(15px)",
  zIndex: "10000",
}));

export interface PopupProps {
  content: ReactNode | null;
  size?: "custom" | "small" | "large";
  paperClassName?: string;
  closable: boolean;
  closeOnBackDropClick?: boolean;
  id?: string;
}

let _item: PopupProps = { content: null, closable: false };
let _callback: () => void = () => undefined;

export function showPopup(props: PopupProps): void {
  _item = props;
  _callback();
}

export function closePopup(): void {
  _item = { content: null, closable: false };
  _callback();
}

function Modal({
  content,
  size = "custom",
  paperClassName,
  closeOnBackDropClick,
  id,
}: Omit<PopupProps, "closable">) {
  return (
    <>
      <CustomBackdrop
        open={true}
        onClick={() => {
          if (closeOnBackDropClick) {
            closePopup();
          }
        }}
      />
      <Dialog
        id={id}
        maxWidth={false}
        open={true}
        onClose={(_event, reason) => {
          if (reason === "backdropClick" && closeOnBackDropClick) {
            closePopup();
          }
        }}
        className={styles.popup}
        PaperProps={{
          className: clsx(
            styles.paper,
            styles.popup,
            styles[size],
            paperClassName,
          ),
        }}
      >
        <div className={"flex col gap12"}>{content || null}</div>
      </Dialog>
    </>
  );
}

export function Popup(): ReactNode {
  const [values, setValues] = useState<PopupProps>(_item);

  useEffect(() => {
    _callback = () => {
      setValues(_item);
    };
  }, []);

  return values.content ? (
    <Modal
      content={
        values.closable ? (
          <ClosablePanel onClose={() => closePopup()}>
            {values.content}
          </ClosablePanel>
        ) : (
          values.content
        )
      }
      size={values.size}
      paperClassName={values.paperClassName}
      closeOnBackDropClick={values.closeOnBackDropClick}
      id={values.id}
    />
  ) : null;
}
