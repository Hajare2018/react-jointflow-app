import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@mui/material';
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@mui/styles';
import { createImageFromInitials, currencyFormatter } from '../../Utils';
import { Link } from 'react-router-dom';
import newTab from '../../../assets/icons/OpenNewTabIconBlue.png';
import { stableSort, getComparator } from '../../../component-lib/JFTable/JFTable';
import { useTenantContext } from '../../../context/TenantContext';

const headCells = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  {
    id: 'percentage_completed',
    numeric: false,
    disablePadding: false,
    label: 'Percentage',
  },
  // { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
  { id: 'project_value', numeric: true, disablePadding: false, label: 'Value' },
  { id: 'owner_name', numeric: true, disablePadding: false, label: 'Owner' },
  { id: 'core_issue', numeric: true, disablePadding: false, label: 'Risk' },
  { id: '', numeric: true, disablePadding: false, label: 'Action' },
];
function EnhancedTableHead({ classes, order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>{order === 'desc' ? '' : ''}</span>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#eef2f6',
    color: theme.palette.common.black,
    fontWeight: '700',
    whiteSpace: 'nowrap',
    overflow: `hidden !important`,
    textOverflow: 'ellipsis',
    // left: 0,
    // position: "sticky",
    // zIndex: theme.zIndex.appBar
  },
  body: {
    // minWidth: "50px",
    fontSize: 16,
    height: 35,
    borderBottom: 0,
    // left: 0,
    // position: "sticky",
    // zIndex: theme.zIndex.appBar,
    // backgroundColor: '#ffffff'
  },
  root: {
    padding: 8,
  },
  alignRight: {
    textAlign: 'unset',
    flexDirection: 'unset',
  },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
  root: {
    '&:nth-of-type(even)': {
      backgroundColor: '#f5f5f5',
    },
  },
}))(TableRow);

const useStyles = makeStyles((_theme) => ({
  table: {
    minWidth: '100%',
  },
  root: {
    width: '100%',
  },
  container: {
    maxHeight: `65vh`,
    '@media(max-height: 1080px)': {
      maxHeight: `58vh`,
    },
    '@media(max-height: 1024px)': {
      maxHeight: `55vh`,
    },
    '@media(max-height: 900px)': {
      maxHeight: `52vh`,
    },
    '@media(max-height: 768px)': {
      maxHeight: `44vh`,
    },
  },
}));

function StatusTable({ data }) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('percentage');
  const { tenant_locale, currency_symbol } = useTenantContext();
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <TableContainer className={classes.container}>
      <Table
        className={classes.table}
        stickyHeader
      >
        <EnhancedTableHead
          classes={classes}
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
        />
        <TableBody>
          {stableSort(data, getComparator(order, orderBy)).map((row) => {
            return (
              <StyledTableRow key={row.id}>
                <StyledTableCell style={{ display: 'flex', position: 'sticky' }}>
                  <Avatar style={{ width: 22, height: 22 }}>
                    {row?.buyer_company_details_light?.company_image === null ? (
                      createImageFromInitials(
                        300,
                        row?.buyer_company_details_light?.name,
                        '#627daf',
                      )
                    ) : (
                      <img
                        src={row?.buyer_company_details_light?.company_image}
                        className="img-lazy-avatar"
                        loading="lazy"
                      />
                    )}
                  </Avatar>
                  <Tooltip
                    title={row?.name}
                    placement="top"
                    arrow
                  >
                    <h4
                      style={{
                        cursor: 'pointer',
                        color: '#6385b7',
                        fontWeight: '700',
                        marginLeft: 10,
                      }}
                    >
                      <Link
                        to={`/board/?id=${row?.id}&navbars=True&actions=True`}
                        target="_self"
                      >
                        {row?.name?.length > 25
                          ? (row?.name).substring(0, 25 - 3) + '...'
                          : row?.name}
                      </Link>
                    </h4>
                  </Tooltip>
                </StyledTableCell>
                <StyledTableCell align="left">{row?.percentage_completed}%</StyledTableCell>
                <StyledTableCell align="left">
                  {currencyFormatter(tenant_locale, row?.project_value, currency_symbol)}
                </StyledTableCell>
                <StyledTableCell align="left">{row?.owner_name}</StyledTableCell>
                <StyledTableCell align="left">
                  {row?.core_issue === null ? 'NA' : row?.core_issue}
                </StyledTableCell>
                <StyledTableCell>
                  <Link
                    to={`/board/?id=${row?.id}&navbars=True&actions=True`}
                    target="_blank"
                  >
                    <img
                      alt=""
                      loading="lazy"
                      src={newTab}
                      style={{ height: 12, width: 12 }}
                    />
                  </Link>
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default React.memo(StatusTable);
