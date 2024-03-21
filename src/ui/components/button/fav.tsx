import { Checkbox } from "@mui/material";
import { ReactNode, useState } from "react";

export function FavButton({
  enable,
  onClick,
}: {
  enable: boolean;
  onClick: (e: boolean) => void;
}): ReactNode {
  const [status, setStatus] = useState(enable);

  return (
    <Checkbox
      checked={status}
      onClick={() => {
        onClick(!status);
        setStatus(!status);
      }}
      icon={<img src={"/images/shape/heart.png"} alt={"unliked"} />}
      checkedIcon={<img src={"/images/shape/heart-filled.png"} alt={"liked"} />}
    />
  );
}
