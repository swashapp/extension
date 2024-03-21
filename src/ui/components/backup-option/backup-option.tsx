import clsx from "clsx";

import { ButtonColors } from "@/enums/button.enum";
import { Button } from "@/ui/components/button/button";

export function BackupOption({
  icon,
  text,
  type = 1,
  imageSize,
  loading,
  onClick,
}: {
  icon: string;
  text: string;
  type?: 1 | 2;
  imageSize?: { width?: number; height?: number };
  loading?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      text={text}
      className={clsx(
        { "full-width-button": type === 1 },
        { "normal-button": type === 2 },
      )}
      color={type === 1 ? ButtonColors.SECONDARY : ButtonColors.TERTIARY}
      loading={loading}
      disabled={onClick === undefined}
      onClick={onClick}
      muiProps={{
        startIcon: (
          <img
            width={imageSize?.width || 20}
            height={imageSize?.height || 20}
            src={icon}
            alt={""}
          />
        ),
      }}
    />
  );
}
