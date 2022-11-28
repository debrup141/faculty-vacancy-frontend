import React, { useState, useMemo, forwardRef, useEffect, useRef } from 'react';
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  usePagination,
  useRowSelect,
  useSortBy,
} from 'react-table';

import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import Grid from '@mui/material/Grid';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

import SearchIcon from '@mui/icons-material/Search';
import CircularProgress from '@mui/material/CircularProgress';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Typography } from '@mui/material';

const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <input type="checkbox" style={{ width: 15, height: 15 }} ref={resolvedRef} {...rest} />
    </>
  );
});

export function GlobalFilter({
  globalFilter,
  setGlobalFilter,
}) {
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
        <FormControl sx={{ width: '100%' }} variant="outlined">
          <OutlinedInput
            id="outlined-adornment-search"
            type="text"
            size="small"
            sx={{backgroundColor: 'white'}}
            value={value || ''}
            onChange={(e) => {
              setValue(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="Search"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  edge="end"
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
  );
}

export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id, Header },
}) {
  const options = useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      if(row.values[id]){
        options.add(row.values[id]);
      }
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  return (
    <FormControl sx={{ width: '100%' }}>
        <InputLabel htmlFor="demo-simple-select-label">{Header}</InputLabel>
        <Select
            labelId="demo-simple-select-label"
            id={id}
            size="small"
            sx={{backgroundColor: 'white'}}
            name={id}
            value={filterValue ? filterValue : ''}
            onChange={(e) => {
              setFilter(e.target.value || '');
            }}
        >
            <MenuItem value=''>All</MenuItem>
            {options.map((option, i) => (
              <MenuItem key={i} value={option}>{option}</MenuItem>
            ))}
        </Select>
    </FormControl>
  );
}

const TableComponent = ({
  columns,
  data,
  initialState,
  isLoading,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    //rows,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    //selectedFlatRows,
    state: { pageIndex, pageSize, globalFilter },
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: 'selection',
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  return (
    <>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={6} lg={4}>
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </Grid>

        {headerGroups.map((headerGroup) =>
          headerGroup.headers.map((column) =>
            column.Filter ? (
              <Grid item xs={12} sm={3} lg={2} key={column.id}>
                {column.render('Filter')}
              </Grid>
            ) : null
          )
        )}
      </Grid>

      <TableContainer component={Paper} sx={{mt: 2}}>
        <Table {...getTableProps()}>
          <TableHead sx={{backgroundColor: '#263354'}}>
            {headerGroups.map((headerGroup, index) => (
              <TableRow key={index} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, i) => (
                  <TableCell
                    key={i}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    style={{ width: column.customWidth }}
                  >
                      <Typography variant="body1" sx={{color: 'white'}}>
                        {column.render('Header')}
                      </Typography>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <TableBody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow
                  key={i}
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell, index) => {
                    return (
                      <TableCell key={index} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination implementation */}

      {page.length > 0 ? (
        <Grid container spacing={1} justifyContent="start" sx={{ my: 4 }}>
          <Grid item xs={12} md={3}>
            <label>Rows per page :{" "}</label>
            <Select size="small"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 20, 50, 100].map((pageSize) => (
                <MenuItem key={pageSize} value={pageSize}>
                  {pageSize}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12} md={3}>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </Grid>

          <Grid item xs={12} md={4}>
            <Button variant="outlined" sx={{mr: 1}} size="small"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
            >
              <KeyboardDoubleArrowLeftIcon />
            </Button>

            <Button variant="outlined" sx={{mr: 1}} size="small"
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
            >
              <KeyboardArrowLeftIcon />
            </Button>

            <Button variant="outlined" sx={{mr: 1}} size="small"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              <KeyboardArrowRightIcon />
            </Button>

            <Button variant="outlined" sx={{mr: 1}} size="small"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              <KeyboardDoubleArrowRightIcon />
            </Button>
          </Grid>
        </Grid>
      ) : isLoading ? (
        <Grid container justifyContent="center" sx={{ my: 2 }}>
          <CircularProgress />
        </Grid>
      ) : (
        <Grid container justifyContent="center" sx={{my: 2}}>
          <Typography variant="h5">Nothing to show here!</Typography>
        </Grid>
      )}
    </>
  );
};

export default TableComponent;
