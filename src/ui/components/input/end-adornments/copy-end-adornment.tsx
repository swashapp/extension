import { ReactNode } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { SystemMessage } from "@/enums/message.enum";
import { EndAdornment } from "@/ui/components/input/end-adornments/end-adornment";
import { toastMessage } from "@/ui/components/toast/toast-message";
import CopyIcon from "~/images/icons/copy.svg?react";

export function CopyEndAdornment({
  value,
  toast = SystemMessage.SUCCESSFULLY_COPIED,
  className,
}: {
  value: string;
  toast?: string;
  className?: string;
}): ReactNode {
  return (
    <EndAdornment className={className}>
      <CopyToClipboard text={value}>
        <CopyIcon
          className={"pointer"}
          onClick={() => toastMessage("success", toast)}
        />
      </CopyToClipboard>
    </EndAdornment>
  );
}
