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
import {
  ChangeEvent,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Select } from '../components/select/select';
import { helper } from '../core/webHelper';
import { UtilsService } from '../service/utils-service';

const categories = [
  { name: 'Claim', value: 'Claim' },
  { name: 'Donation', value: 'Donation' },
  { name: 'Management', value: 'Management' },
  { name: 'Withdrawal', value: 'Withdrawal' },
];

export function History(): ReactElement {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [pageRows, setPageRows] = useState([]);
  const [category, setCategory] = useState<string>(categories[0].value);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [charities, setCharities] = useState<any[]>([]);

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
    helper.getCharities().then(setCharities);
  }, [category, rowsPerPage]);

  useEffect(() => {
    setPageRows(rows.slice((page - 1) * rowsPerPage, page * rowsPerPage));
  }, [page, rows, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const getMessage = useCallback(
    (item: { amount?: string; to?: string; status?: string }) => {
      if (category === 'Claim') {
        return `Claimed ${UtilsService.purgeNumber(
          formatEther(item?.amount || '0'),
          4,
        )} $SWASH from your Rewards`;
      } else if (category === 'Donation') {
        const charity = charities.find(
          (value) => value.address.toLowerCase() === item?.to?.toLowerCase(),
        );
        return `Donated ${UtilsService.purgeNumber(
          formatEther(item?.amount || '0'),
          4,
        )} $SWASH to ${charity ? charity?.name : item?.to}`;
      } else if (category === 'Management') {
        return `${
          item?.status === 'Joined' ? item.status : 'Left'
        } the Swash Data Union`;
      } else if (category === 'Withdrawal') {
        return `Withdrew ${UtilsService.purgeNumber(
          formatEther(item?.amount || '0'),
          4,
        )} $SWASH to ${UtilsService.purgeString(item?.to || '', 6)}`;
      }
    },
    [category, charities],
  );

  return (
    <>
      <div className={'page-header'}>
        <h6>History</h6>
      </div>
      <div className={'flex col gap32'}>
        <div className={'round no-overflow bg-white card'}>
          <div className={'flex col gap32'}>
            <div className={'flex align-center justify-between'}>
              <p>
                Monitor your withdrawal, claim, donation, and Swash history
                using the table below.
              </p>
              <div className={'history-filter-container'}>
                <Select
                  label={'Filter by'}
                  items={categories}
                  value={category}
                  onChange={(e) => setCategory(e.target.value as string)}
                />
              </div>
            </div>
            {loading ? (
              <div className={'flex center history-loading'}>
                <CircularProgress color={'inherit'} size={32} />
              </div>
            ) : (
              <TableContainer
                component={Paper}
                className={'history-table-container'}
              >
                <Table
                  sx={{ minWidth: 650 }}
                  size={'medium'}
                  aria-label={'a dense table'}
                >
                  <TableHead className={'history-table-header'}>
                    <TableRow>
                      <TableCell>Time</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Transaction</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className={'history-table-body'}>
                    {pageRows.map(
                      (
                        row: {
                          id: string;
                          time: string;
                          amount?: string;
                          to?: string;
                          status?: string;
                        },
                        index,
                      ) => (
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
                          <TableCell>{getMessage(row)}</TableCell>
                          <TableCell>
                            <a
                              href={`https://gnosisscan.io/tx/${
                                row.id.split('-')[0]
                              }`}
                              target={'_blank'}
                              rel={'noreferrer'}
                            >
                              {UtilsService.purgeString(row.id.split('-')[0])}
                            </a>
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            <div
              className={
                'flex row align-center justify-between history-table-pagination'
              }
            >
              <TablePagination
                component={'div'}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page - 1}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage={<span>Show rows</span>}
                labelDisplayedRows={() => ``}
                ActionsComponent={() => <div />}
              />
              <Pagination
                className={'bg-off-white history-table-pagination-pages'}
                count={Math.ceil(rows.length / rowsPerPage)}
                page={page}
                onChange={handleChangePage}
                shape={'rounded'}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
