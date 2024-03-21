import { ReactNode } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { SystemMessage } from "@/enums/message.enum";
import { EndAdornment } from "@/ui/components/input/end-adornments/end-adornment";

import { toastMessage } from "../../toast/toast-message";

export function CopyEndAdornment({
  value,
  toast = SystemMessage.SUCCESSFULLY_COPIED,
}: {
  value: string;
  toast?: string;
}): ReactNode {
  return (
    <EndAdornment>
      <CopyToClipboard text={value}>
        <img
          src={"/images/icons/copy.svg"}
          alt={"copy"}
          className={"pointer"}
          onClick={() => toastMessage("success", toast)}
        />
      </CopyToClipboard>
    </EndAdornment>
  );
}
