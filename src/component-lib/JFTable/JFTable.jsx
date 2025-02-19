import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  TableSortLabel,
  TableFooter,
  TablePagination,
} from '@mui/material';
import { withStyles } from '@mui/styles';
import PropTypes from 'prop-types';

export function stableSort(array, comparator) {
  const stabilizedThis = (array || []).map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#eef2f6',
    color: theme.palette.common.black,
    fontWeight: '700',
    whiteSpace: 'nowrap',
    overflow: `hidden !important`,
    textOverflow: 'ellipsis',
  },
  root: {
    padding: '8px 16px',
  },
  body: {
    height: 35,
    borderBottom: 0,
  },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
  root: {
    '&:nth-of-type(even)': {
      backgroundColor: '#f5f5f5',
    },
  },
}))(TableRow);

function JFTableHead({ orderDirection, orderedBy, onHeaderCellClick, columns }) {
  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <StyledTableCell
            key={column.id}
            align={column.align}
          >
            <TableSortLabel
              active={column.id === orderedBy}
              direction={orderDirection}
              onClick={() => onHeaderCellClick(column.id)}
            >
              {column.label}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function JFTable(props) {
  const {
    data,
    columns,
    orderedBy,
    orderDirection,
    onHeaderCellClick,
    showFooter = false,
    rowHeight = 35,
    rowIdProp = 'id',
  } = props;

  return (
    <Table stickyHeader>
      <JFTableHead
        columns={columns}
        orderedBy={orderedBy}
        orderDirection={orderDirection}
        onHeaderCellClick={onHeaderCellClick}
      />
      <TableBody>
        {data.map((datum) => {
          return (
            <StyledTableRow
              key={datum[rowIdProp]}
              height={rowHeight}
            >
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                >
                  {column.cell ? column.cell(datum) : datum[column.id]}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          );
        })}
      </TableBody>
      {showFooter && (
        <TableFooter>
          <TableRow>
            <TablePagination
              count={data.length}
              rowsPerPage={-1}
              page={0}
              onPageChange={() => {}}
              labelRowsPerPage=""
              rowsPerPageOptions={[]}
            />
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
}

JFTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      cell: PropTypes.func,
    }),
  ),
  orderedBy: PropTypes.string,
  orderDirection: PropTypes.oneOf(['asc', 'desc']),
  onHeaderCellClick: PropTypes.func.isRequired,
  showFooter: PropTypes.bool,
  rowHeight: PropTypes.number,
};
