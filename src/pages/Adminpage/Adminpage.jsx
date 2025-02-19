import {
  Button,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Table,
  TableCell,
  IconButton,
  Tooltip,
} from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import {
  AccountBoxOutlined,
  ContactMail,
  LaunchOutlined,
  Person,
  PersonAdd,
  RefreshOutlined,
} from '@mui/icons-material';
import PropTypes from 'prop-types';
import SearchBar from '../../component-lib/SearchBar/SearchBar';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { requestAllTenants } from '../../Redux/Actions/admin/tenant-list';
import { show } from '../../Redux/Actions/loader';
import { timeAgo } from '../../components/Utils';
import Loader from '../../components/Loader';
import NewTenantForm from '../../components/Admin/NewTenantForm';
import SuperUserForm from '../../components/Admin/SuperUserForm';
import { stableSort, getComparator } from '../../component-lib/JFTable/JFTable';
import config from '../../config';

const headCells = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Company Name' },
  {
    id: 'schema_name',
    numeric: true,
    disablePadding: false,
    label: 'Schema Name',
  },
  {
    id: 'created_at',
    numeric: true,
    disablePadding: false,
    label: 'Created at',
  },
  {
    id: 'on_trial',
    numeric: true,
    disablePadding: false,
    label: 'On Trial',
  },
  {
    id: 'active_staff',
    numeric: true,
    disablePadding: false,
    label: 'Staffs',
  },
  {
    id: 'active_contacts',
    numeric: true,
    disablePadding: false,
    label: 'Contacts',
  },
  {
    id: '',
    numeric: true,
    disablePadding: false,
    label: 'Actions',
  },
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
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
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
  },
  root: {
    padding: 8,
  },
  body: {
    fontSize: 16,
    height: 35,
    borderBottom: 0,
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
      maxHeight: `83vh`,
    },
    '@media(max-height: 1024px)': {
      maxHeight: `78vh`,
    },
    '@media(max-height: 900px)': {
      maxHeight: `65vh`,
    },
    '@media(max-height: 768px)': {
      maxHeight: `52vh`,
    },
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

function Adminpage() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const tenants = useSelector((state) => state.allTenantsData);
  const loader = useSelector((state) => state.showLoader);
  const tenantData = tenants?.data?.length > 0 ? tenants?.data : [];
  let activeUsers = [];
  let activeContacts = [];
  const [showForm, setShowForm] = useState(false);
  const [rows, setRows] = useState(tenantData);
  const [searched, setSearched] = useState('');
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('created_at');
  const [showUserForm, setShowUserForm] = useState(false);
  const [schemaName, setSchemaName] = useState('');

  tenantData?.forEach((element) => {
    activeUsers.push(element?.tenant_usage?.users?.active_staff);
    activeContacts.push(element?.tenant_usage?.users?.active_contacts);
  });
  const totalActiveUsers = activeUsers?.reduce((a, b) => a + b, 0);
  const totalActiveContacts = activeContacts?.reduce((a, b) => a + b, 0);

  useEffect(() => {
    doRefresh();
  }, []);

  const doRefresh = () => {
    dispatch(show(true));
    dispatch(requestAllTenants());
  };

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  const handleShowUserForm = (name) => {
    setShowUserForm(!showUserForm);
    setSchemaName(name);
  };

  const requestSearch = (searchedVal) => {
    const filteredRows = tenantData.filter((row) => {
      return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setRows(filteredRows);
  };

  const cancelSearch = () => {
    setSearched('');
    requestSearch(searched);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const environment = config.REACT_APP_ENV;

  return (
    <div>
      <main
        id="page"
        className="admin-panel-view"
      >
        <div
          style={{
            position: 'sticky',
            top: '5px !important',
            backgroundColor: '#f9fbfd',
            zIndex: 4,
          }}
        >
          <div
            id="head-title"
            className="project-header"
          >
            <h1
              className="overview__heading_project"
              style={{ float: 'left' }}
            >
              All Tenants
            </h1>
          </div>
          <div
            id="analytics-card"
            className="analytics-card-container tour-project-cards"
          >
            <div className="analytics-card analytics-card__one">
              <div className="analytics-card__content">
                <p>Number of Tenants</p>
                <strong>{tenantData?.length}</strong>
              </div>
              <div className="analytics-card__icon">
                <AccountBoxOutlined style={{ width: 40, height: 40, color: '#3edab7' }} />
              </div>
            </div>
            <div className="analytics-card analytics-card__two">
              <div className="analytics-card__content">
                <p>Total Number of Active Staff Users</p>
                <strong>{totalActiveUsers}</strong>
              </div>
              <div className="analytics-card__icon">
                <Person style={{ width: 40, height: 40, color: '#83bdff' }} />
              </div>
            </div>
            <div className="analytics-card analytics-card__three">
              <div className="analytics-card__content">
                <p>Total number of Active Contacts</p>
                <strong>{totalActiveContacts}</strong>
              </div>
              <div className="analytics-card__icon">
                <ContactMail style={{ width: 40, height: 40, color: '#fc8c8a' }} />
              </div>
            </div>
          </div>
          <div className="tour-project-table-header d-flex justify-space-between">
            <SearchBar
              style={{
                width: 'auto',
                borderColor: '#eef2f6',
                backgroundColor: '#f9fbfd',
              }}
              value={searched}
              onChange={(searchVal) => requestSearch(searchVal)}
              onCancelSearch={() => cancelSearch()}
            />
            <div className="d-flex">
              <Tooltip title="Refresh Table">
                <IconButton onClick={doRefresh}>
                  <RefreshOutlined style={{ width: 30, height: 30, color: '#6385b7' }} />
                </IconButton>
              </Tooltip>
              <Button
                style={{
                  backgroundColor: '#6385b7',
                  color: '#ffffff',
                  borderRadius: '2rem',
                  textTransform: 'none',
                }}
                variant="contained"
                onClick={handleShowForm}
              >
                <strong>+ Create Tenant</strong>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-3">
          {loader.show ? (
            <Loader />
          ) : (
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
                  {stableSort(
                    rows.length > 0 ? rows : tenantData,
                    getComparator(order, orderBy),
                  ).map((row) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell>{row.name}</StyledTableCell>
                      <StyledTableCell>
                        {row.schema_name}
                        <a
                          className="ml-2"
                          href={
                            '//' +
                            row.schema_name +
                            `${
                              environment == 'staging'
                                ? '.stage.appjointflows.com'
                                : '.appjointflows.com'
                            }`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <LaunchOutlined />
                        </a>
                      </StyledTableCell>
                      <StyledTableCell>
                        {timeAgo(new Date(row.created_at).getTime())}
                      </StyledTableCell>
                      <StyledTableCell>{row.on_trail ? 'True' : 'False'}</StyledTableCell>
                      <StyledTableCell>
                        <strong style={{ color: '#3edab7' }}>
                          {row?.tenant_usage?.users?.active_staff}
                        </strong>
                        /
                        <strong style={{ color: '#fc8c8a' }}>
                          {row?.tenant_usage?.users?.inactive_Staff}
                        </strong>
                      </StyledTableCell>
                      <StyledTableCell>
                        <strong style={{ color: '#3edab7' }}>
                          {row?.tenant_usage?.users?.active_contacts}
                        </strong>
                        /
                        <strong style={{ color: '#fc8c8a' }}>
                          {row?.tenant_usage?.users?.inactive_contacts}
                        </strong>
                      </StyledTableCell>
                      <StyledTableCell>
                        <IconButton onClick={() => handleShowUserForm(row.schema_name)}>
                          <PersonAdd />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </main>
      <NewTenantForm
        open={showForm}
        handleClose={handleShowForm}
      />
      <SuperUserForm
        open={showUserForm}
        handleClose={handleShowUserForm}
        schemaName={schemaName}
      />
    </div>
  );
}

export default React.memo(Adminpage);
