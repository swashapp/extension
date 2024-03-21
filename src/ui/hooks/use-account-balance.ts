import { useCallback, useEffect, useState } from "react";

import { helper } from "@/helper";
import { BalanceRes } from "@/types/api/balance.type";

import { useErrorHandler } from "./use-error-handler";

export function useAccountBalance() {
  const { safeRun } = useErrorHandler();

  const [balance, setBalance] = useState<BalanceRes>({
    balance: NaN,
    balanceInUSD: NaN,
  });

  const updateBalance = useCallback(async () => {
    safeRun(async () => {
      if (!(await helper("coordinator").isReady())) return;
      setBalance(await helper("payment").getBalance());
    });
  }, [safeRun]);

  useEffect(() => {
    updateBalance();
  }, [updateBalance]);

  return { ...balance, updateBalance };
}
