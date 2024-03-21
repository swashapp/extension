import {
  CircularProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import clsx from "clsx";
import {
  useMemo,
  useState,
  ChangeEvent,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

import { Any } from "@/types/any.type";

import styles from "./dynamic-table.module.css";

type DataRow = Record<string, string>;

export function DynamicTable({
  data,
  loading,
  total,
  hidePagination,
  onPageChange,
  onPageSizeChange,
  onRowDoubleClick,
  onEmptyDataDisplay,
}: {
  data: DataRow[];
  loading: boolean;
  total: number;
  hidePagination?: boolean;
  onPageChange?: (page: number, pageSize: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onRowDoubleClick?: (row: DataRow) => void;
  onEmptyDataDisplay?: ReactNode;
}) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortColumn, setSortColumn] = useState<string>(
    data[0] && Object.keys(data[0])[0] ? Object.keys(data[0])[0] : "",
  );

  const handleSort = (column: string) => {
    const isAsc = sortColumn === column && sortDirection === "asc";
    setSortDirection(isAsc ? "desc" : "asc");
    setSortColumn(column);
  };

  const columns = useMemo(() => {
    if (data[0]) return Object.keys(data[0]);
    else return [""];
  }, [data]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      if (a[sortColumn] < b[sortColumn])
        return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn])
        return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const handlePageChange = useCallback(
    (_event: Any, newPage: number) => {
      setPage(newPage);
      if (onPageChange) onPageChange(newPage, pageSize);
    },
    [onPageChange, pageSize],
  );

  const handlePageSizeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newPageSize = parseInt(event.target.value, 10);
      setPageSize(newPageSize);
      setPage(1);
      if (onPageSizeChange) onPageSizeChange(newPageSize);
    },
    [onPageSizeChange],
  );

  useEffect(() => {
    if (data.length === 0 && onPageChange) {
      setPage(1);
      onPageChange(page, pageSize);
    }
  }, [data.length, onPageChange, page, pageSize]);

  return (
    <>
      {loading ? (
        <div className={clsx("flex center", styles.loading)}>
          <CircularProgress color={"inherit"} size={32} />
        </div>
      ) : total === 0 && onEmptyDataDisplay ? (
        onEmptyDataDisplay
      ) : (
        <>
          <TableContainer component={Paper} className={styles.container}>
            <Table size={"medium"} aria-label={"a dense table"}>
              <TableHead className={styles.header}>
                <TableRow>
                  {columns.map((col) => (
                    <TableCell
                      key={col}
                      onClick={() => handleSort(col)}
                      style={{ textWrap: "nowrap", cursor: "pointer" }}
                    >
                      {col}{" "}
                      {sortColumn === col
                        ? sortDirection === "asc"
                          ? "↑"
                          : "↓"
                        : ""}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody className={styles.body}>
                {sortedData.map((row, index) => (
                  <TableRow
                    key={index}
                    onDoubleClick={() =>
                      onRowDoubleClick && onRowDoubleClick(row)
                    }
                  >
                    {columns.map((col) => (
                      <TableCell key={col}>{row[col]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {hidePagination ? null : (
            <div
              className={clsx(
                "flex row align-center justify-between",
                styles.pagination,
              )}
            >
              <TablePagination
                className={styles.rows}
                component={"div"}
                count={total}
                rowsPerPage={pageSize}
                page={page - 1}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handlePageSizeChange}
                rowsPerPageOptions={[5, 10, 15, 25, 50]}
                labelRowsPerPage={<span className={"small"}>Show rows</span>}
                labelDisplayedRows={() => ``}
                ActionsComponent={() => <div />}
              />
              <Pagination
                className={styles.pages}
                count={Math.ceil(total / pageSize)}
                page={page}
                onChange={handlePageChange}
                shape={"rounded"}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
