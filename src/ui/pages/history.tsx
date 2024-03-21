import clsx from "clsx";
import { ReactNode, useCallback, useMemo, useState } from "react";

import {
  HistoryService,
  OfferStatus,
  PaymentHistory,
} from "@/enums/history.enum";
import { helper } from "@/helper";
import { Any } from "@/types/any.type";
import { SelectItem } from "@/types/ui.type";
import { DynamicTable } from "@/ui/components/dynamic-table/dynamic-table";
import { Select } from "@/ui/components/input/select";
import { MultiTabView } from "@/ui/components/multi-tab-view/multi-tab-view";
import { PageHeader } from "@/ui/components/page-header/page-header";
import { useErrorHandler } from "@/ui/hooks/use-error-handler";
import HistoryIcon from "~/images/icons/history-file.svg?react";
import ActivityReportIcon from "~/images/icons/history-time.svg?react";

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
  const [total, setTotal] = useState<number>(-1);

  const onPageChange = useCallback(
    async (page: number, pageSize: number) => {
      await safeRun(
        async () => {
          setLoading(true);

          const resp = await helper(service).getHistory(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            category,
            page - 1,
            pageSize,
          );

          setData(resp.data);
          setTotal(resp.total);
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
    async (pageSize: number) => {
      await onPageChange(1, pageSize);
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
        onEmptyDataDisplay={
          <div className={clsx("flex col center gap32", styles.empty)}>
            <img
              src={"/images/misc/cradle-ball.webp"}
              alt={"No history"}
              className={styles.cradle}
            />
            <p className={"text-center"}>
              Your {category} reports will appear here.
            </p>
          </div>
        }
      />
    );
  }, [data, loading, total, onPageChange, onPageSizeChange, category]);

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
