import {
  Box,
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
import React from 'react';

import { BackgroundTheme } from '../components/drawing/background-theme';
import { FlexGrid } from '../components/flex-grid/flex-grid';
import { Select } from '../components/select/select';

function createData(time: string, transaction: string, amount: number) {
  return { time, transaction, amount };
}

const rows = [
  createData('Dec 17, 2021 04:00:01 AM', 'Donated to Mercy For Animals', 100.1),
  createData(
    'Dec 16, 2021 04:00:01 AM',
    'Donated to Meals on Wheels America',
    2043.0,
  ),
  createData('Dec 15, 2021 04:00:01 AM', 'Donated to PETA', 16.0),
  createData('Dec 14, 2021 04:00:01 AM', 'Donated to Feeding America', 891.7),
  createData(
    'Dec 13, 2021 04:00:01 AM',
    'Donated to Mercy For Animals',
    1019.0,
  ),
];

const categories = [
  { name: 'Claim', value: 'Claim' },
  { name: 'Donation', value: 'Donation' },
  { name: 'Withdrawal', value: 'Withdrawal' },
];

export function Transactions(): JSX.Element {
  const [category, setCategory] = React.useState<string>(categories[0].value);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="page-container">
      <BackgroundTheme layout="layout2" />
      <div className="page-content">
        <div className="flex-column card-gap">
          <div className="simple-card">
            <div className="flex-column card-gap">
              <FlexGrid column={2} className={'transaction-header-container'}>
                <h2>Transactions</h2>
                <div className={'transaction-filter-container'}>
                  <Select
                    label={'Filter by'}
                    items={categories}
                    value={category}
                    onChange={(e) => setCategory(e.target.value as string)}
                  />
                </div>
              </FlexGrid>
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
                    {rows.map((row) => (
                      <TableRow key={row.time}>
                        <TableCell>{row.time}</TableCell>
                        <TableCell>{row.transaction}</TableCell>
                        <TableCell>{row.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
