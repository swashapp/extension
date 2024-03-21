import { createContext } from "react";

import { InitialAccountInfoRes } from "@/core/data/initial-cache";
import { AccountInfoRes } from "@/types/api/account.type";

export const DashboardContext = createContext<{
  account: AccountInfoRes;
  update: (path?: string) => Promise<void>;
}>({
  account: InitialAccountInfoRes,
  update: async () => undefined,
});
