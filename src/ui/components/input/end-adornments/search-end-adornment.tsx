import { ReactNode } from "react";

import { EndAdornment } from "@/ui/components/input/end-adornments/end-adornment";
import SearchIcon from "~/images/icons/search.svg?react";

export function SearchEndAdornment(): ReactNode {
  return (
    <EndAdornment>
      <SearchIcon className={"pointer"} />
    </EndAdornment>
  );
}
