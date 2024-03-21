import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import {
  HistoryService,
  OfferStatus,
  PaymentHistory,
} from "@/enums/history.enum";
import { helper } from "@/helper";
import { Any } from "@/types/any.type";
import { SelectItem } from "@/types/ui.type";
import HistoryIcon from "~/images/icons/history-file.svg?react";
import ActivityReportIcon from "~/images/icons/history-time.svg?react";

import { DynamicTable } from "../components/dynamic-table/dynamic-table";
import { Select } from "../components/input/select";
import { MultiTabView } from "../components/multi-tab-view/multi-tab-view";
import { PageHeader } from "../components/page-header/page-header";
import { useErrorHandler } from "../hooks/use-error-handler";

import styles from "./history.module.css";

function getItems(obj: Any) {
  return Object.values(obj).map((value) => ({
    value: value as string,
    display: value as string,
  }));
}

const activity = getItems(PaymentHistory);
const earn = getItems(OfferStatus);

export function History(): ReactNode {
  const { safeRun } = useErrorHandler();

  const [service, setService] = useState<HistoryService>(
    HistoryService.PAYMENT,
  );
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SelectItem[]>(activity);
  const [category, setCategory] = useState<string>(activity[0].value);
  const [data, setData] = useState<Any[]>([]);
  const [total, setTotal] = useState<number>(0);

  const onPageChange = useCallback(
    (page: number, pageSize: number) => {
      safeRun(
        async () => {
          setLoading(true);

          let history: Any[] = [];
          let total: number = 0;

          if (service === HistoryService.PAYMENT) {
            [history, total] = await helper(service).getHistory(
              category as never,
              page - 1,
              pageSize,
            );
          } else if (service === HistoryService.EARN) {
            [history, total] = await helper(service).getHistory(
              category as never,
              page - 1,
              pageSize,
            );
          }

          setData(history);
          setTotal(total);
        },
        {
          finally: () => {
            setLoading(false);
          },
        },
      );
    },
    [category, safeRun, service],
  );

  const onTabChange = useCallback((index: number) => {
    if (index === 0) {
      setService(HistoryService.PAYMENT);
      setFilters(activity);
      setCategory(activity[0].value);
      setData([]);
    } else {
      setService(HistoryService.EARN);
      setFilters(earn);
      setCategory(earn[0].value);
      setData([]);
    }
  }, []);

  const onPageSizeChange = useCallback(
    (pageSize: number) => {
      onPageChange(1, pageSize);
    },
    [onPageChange],
  );

  const onCategoryChange = useCallback((category: string) => {
    setCategory(category);
    setData([]);
  }, []);

  const view = useMemo(() => {
    return (
      <DynamicTable
        data={data}
        loading={loading}
        total={total}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    );
  }, [data, onPageChange, onPageSizeChange, loading, total]);

  useEffect(() => {}, []);

  const tabs = useMemo(() => {
    return [
      {
        label: (
          <div className={"flex row gap4 center"}>
            <ActivityReportIcon />
            <p className={"bold"}>Activity reports</p>
          </div>
        ),
        content: <div className={"flex col gap32"}>{view}</div>,
      },
      {
        label: (
          <div className={"flex row gap4 center"}>
            <HistoryIcon />
            <p className={"bold"}>Earn history</p>
          </div>
        ),
        content: <div className={"flex col gap32"}>{view}</div>,
      },
    ];
  }, [view]);

  return (
    <>
      <PageHeader header={"History"} />
      <div className={"round no-overflow bg-white card28"}>
        <MultiTabView
          tabs={tabs}
          action={
            <div className={styles.filter}>
              <Select
                label={"Filter by"}
                value={category}
                items={filters}
                onChange={(e) => {
                  onCategoryChange(e.target.value as string);
                }}
              />
            </div>
          }
          onTabChange={onTabChange}
        />
      </div>
    </>
  );
}
