import { formatEther } from '@ethersproject/units';
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
} from '@mui/material';
import React, { useEffect } from 'react';

import { HISTORY_TOUR_CLASS } from '../components/components-tour/history-tour';
import { BackgroundTheme } from '../components/drawing/background-theme';
import { FlexGrid } from '../components/flex-grid/flex-grid';
import { Select } from '../components/select/select';
import { helper } from '../core/webHelper';

const categories = [
  { name: 'Claim', value: 'Claim' },
  // { name: 'Donation', value: 'Donation' },
  { name: 'Withdrawal', value: 'Withdrawal' },
];

export function History(): JSX.Element {
  const [loading, setLoading] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [pageRows, setPageRows] = React.useState([]);
  const [category, setCategory] = React.useState<string>(categories[0].value);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  useEffect(() => {
    setLoading(true);
    helper
      .getUserHistory(category)
      .then((data) => {
        setRows(data);
        setPage(1);
        setPageRows(data.slice(0, rowsPerPage));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category, rowsPerPage]);

  useEffect(() => {
    console.log('page', page);
    setPageRows(rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage));
  }, [page, rows, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  return (
    <div className="page-container">
      <BackgroundTheme layout="layout2" />
      <div className="page-content">
        <div className="flex-column card-gap">
          <div className="simple-card">
            <div className="flex-column card-gap">
              <FlexGrid column={2} className="transaction-header-container">
                <div className={HISTORY_TOUR_CLASS.ARCHIVES}>
                  <h2>History</h2>Monitor your withdrawal and claim history
                  using the table below.
                </div>
                <div className={'transaction-filter-container'}>
                  <Select
                    label={'Filter by'}
                    items={categories}
                    value={category}
                    onChange={(e) => setCategory(e.target.value as string)}
                  />
                </div>
              </FlexGrid>
              {loading ? (
                <div className={'transaction-loading'}>
                  <CircularProgress color={'inherit'} size={32} />
                </div>
              ) : (
                <TableContainer
                  component={Paper}
                  className={'transaction-table-container'}
                >
                  <Table
                    sx={{ minWidth: 650 }}
                    size="medium"
                    aria-label="a dense table"
                  >
                    <TableHead className={'transaction-table-header'}>
                      <TableRow className={'title'}>
                        <TableCell>Time</TableCell>
                        <TableCell>Transaction</TableCell>
                        <TableCell>Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody className={'transaction-table-body'}>
                      {pageRows.map((row, index) => (
                        <TableRow key={`${index}${row.time}`}>
                          <TableCell>
                            {new Date(+row.time * 1000).toLocaleString(
                              'en-US',
                              {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                second: '2-digit',
                              },
                            )}
                          </TableCell>
                          <TableCell>
                            <a
                              href={`https://blockscout.com/xdai/mainnet/tx/${
                                row.id.split('-')[0]
                              }`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {row.id.split('-')[0]}
                            </a>
                          </TableCell>
                          <TableCell>{formatEther(row.amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              <FlexGrid column={2} className={'transaction-table-pagination'}>
                <TablePagination
                  component={'div'}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25]}
                  labelRowsPerPage={<span>Show rows</span>}
                  labelDisplayedRows={() => ``}
                  ActionsComponent={() => <div />}
                />
                <Pagination
                  className={'transaction-table-pagination-pages'}
                  count={rows.length / rowsPerPage}
                  page={page}
                  onChange={handleChangePage}
                  shape="rounded"
                />
              </FlexGrid>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
