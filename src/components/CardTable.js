import {
  useTable,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
} from 'react-table';

import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import {GlobalFilter} from './Table';

const CardTable = ({
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
    state: { globalFilter },
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
  );

  if(isLoading){
    return(
        <Grid container justifyContent="center" sx={{ my: 2 }}>
          <CircularProgress />
        </Grid>
    )
  }

  return (
    <>
      <Grid container spacing={2} sx={{ marginTop: 2 }} justifyContent="center">
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

      <Container sx={{mt: 2}}>
        {page.length > 0 ? (
            <Box sx={{width: '100%'}} {...getTableProps()}>
            <Box sx={{width: '100%'}} {...getTableBodyProps()}>
                {page.map((row, i) => {
                prepareRow(row);
                return (
                    <Grid container spacing={2}
                    justifyContent="center"
                    key={i}
                    {...row.getRowProps()}
                    >
                        {row.cells.map((cell, index) => 
                            cell.column.customWidth ?
                            (<Grid item xs={12} md={10} key={index} sx={{mb: 4}} {...cell.getCellProps()}>
                                {cell.render('Cell')}
                            </Grid>) : null
                        )}
                    </Grid>
                );
                })}
            </Box>
            </Box>) : (
                <Grid container justifyContent="center" sx={{my: 2}}>
                    <Typography variant="h5">Nothing to show here!</Typography>
                </Grid>
            )}
      </Container>
    </>
  );
};

export default CardTable;
