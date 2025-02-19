import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useDispatch, useSelector } from 'react-redux';
import { getCompanies, requestCompanyData } from '../../Redux/Actions/companies';
import { show } from '../../Redux/Actions/loader';
import Loader from '../Loader';
import { Add, Edit, RefreshRounded } from '@mui/icons-material';
import {
  Avatar,
  Fab,
  FormControlLabel,
  IconButton,
  Switch,
  TableSortLabel,
  Tooltip,
} from '@mui/material';
import AddNewCompany from './AddNewCompany';
import '../Documents/DocumentsLibrary/document.css';
import ArchiveDialog from './ArchiveDialog';
import CompanyDetails from './CompanyDetails';
import { withStyles } from '@mui/styles';
import ArchiveIcon from '../../assets/icons/archive.png';
import ArchiveDanger from '../../assets/icons/archive_danger.png';
import SearchBar from '../../component-lib/SearchBar/SearchBar';
import CompanyUsers from './CompanyUsers';
import { getAllUsers } from '../../Redux/Actions/user-info';
import { stableSort, getComparator } from '../../component-lib/JFTable/JFTable';

const headCells = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  {
    id: 'parent_company',
    numeric: false,
    disablePadding: false,
    label: 'Parent Company',
  },
  {
    id: 'website_url',
    numeric: false,
    disablePadding: false,
    label: 'Website Url',
  },
  { id: 'industry', numeric: false, disablePadding: false, label: 'Industry' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
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

const useStyles = makeStyles({
  table: {
    minWidth: '100%',
  },
  container: {
    maxHeight: `calc(100vh - 318px)`,
  },
});

const StyledTableCell = withStyles(() => ({
  head: {
    color: '#000000',
    fontWeight: '700',
  },
  root: {
    borderBottom: `0px !important`,
    padding: `8px !important`,
  },
  body: {
    fontSize: 16,
    height: 20,
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

function CompaniesTable({ view }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [switchedValue, setSwitchedValue] = React.useState(false);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState([]);
  const [openArchive, setOpenArchive] = useState(false);
  const [dataForArchive, setDataForArchive] = useState([]);
  const [showCompany, setShowCompany] = useState(false);
  const [searched, setSearched] = useState('');
  const [rows, setRows] = useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('end_date');

  const handleShowCompany = (e) => {
    dispatch(requestCompanyData({ id: e.id }));
    dispatch(
      getAllUsers({
        company_id: e.id,
        usersByCompany: true,
      }),
    );
    setEditData(e);
    setShowCompany(true);
  };

  const handleCloseCompany = () => setShowCompany(false);

  const handleOpen = (e) => {
    setSearched('');
    setEditData(e);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSwitch = () => {
    doRefresh();
    setSwitchedValue(!switchedValue);
  };
  const allUsersData = useSelector((state) => state?.allUsersData);
  let activeUsers =
    allUsersData?.data?.length > 0
      ? allUsersData?.data?.filter((item) => item?.is_active === true)
      : [];

  const companiesData = useSelector((state) => state?.companiesData);
  const archivedCompanies =
    companiesData?.data?.length > 0
      ? companiesData?.data?.filter((item) => item?.archived === true)
      : [];
  const allCompanies =
    companiesData?.data?.length > 0
      ? companiesData?.data?.filter((item) => item?.archived === false)
      : [];
  const loader = useSelector((state) => state?.showLoader);
  useEffect(() => {
    doRefresh();
  }, []);

  useEffect(() => {
    setSearched('');
    setRows(switchedValue ? archivedCompanies : allCompanies);
  }, [companiesData]);

  const doRefresh = () => {
    dispatch(show(true));
    dispatch(getCompanies());
  };

  const handleArchive = (e) => {
    setDataForArchive(e);
    setOpenArchive(true);
  };

  const closeArchive = () => {
    setOpenArchive(false);
  };

  function splitUrl(url) {
    let splitted = url?.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')?.split('/')[0];
    return splitted;
  }

  const requestSearch = (searchedVal) => {
    const filteredRows = (switchedValue ? archivedCompanies : allCompanies)?.filter((row) => {
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

  return (
    <>
      <>
        {view === 'company' ? (
          <>
            <div className="d-flex-wrap justify-space-around w-100 p-5">
              <div>
                <SearchBar
                  style={{
                    width: '100%',
                    borderColor: '#eef2f6',
                    backgroundColor: '#f9fbfd',
                  }}
                  value={searched}
                  onChange={(searchVal) => requestSearch(searchVal)}
                  onCancelSearch={() => cancelSearch()}
                />
              </div>
              <div
                className="ArchivedAC"
                style={{ float: 'left' }}
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={switchedValue}
                      onChange={handleSwitch}
                      name="checkedA"
                    />
                  }
                  label={
                    <span>
                      {switchedValue ? 'Hide Archived Companies' : 'Display Archived Companies'}
                    </span>
                  }
                />
              </div>
              <div style={{ float: 'right' }}>
                <Tooltip
                  title="Add New Company"
                  placement="top"
                  arrow
                >
                  <Fab
                    size="small"
                    onClick={handleOpen}
                    style={{ backgroundColor: '#627daf', color: '#ffffff' }}
                  >
                    <Add style={{ height: 30, width: 30 }} />
                  </Fab>
                </Tooltip>
              </div>
              <div>
                <Tooltip
                  title="Refresh Table"
                  placement="top"
                  arrow
                >
                  <IconButton onClick={doRefresh}>
                    <RefreshRounded style={{ color: '#627daf', height: 40, width: 40 }} />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
            {loader.show ? (
              <Loader />
            ) : (
              <TableContainer className={classes.container}>
                {rows?.length > 0 ? (
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
                      {stableSort(rows, getComparator(order, orderBy)).map((row) => (
                        <StyledTableRow key={row.id}>
                          <StyledTableCell
                            style={{ fontSize: 16 }}
                            scope="row"
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                color: '#627daf',
                                fontWeight: '700',
                                cursor: 'pointer',
                                textDecoration: 'underline',
                              }}
                            >
                              <Avatar
                                className="mr-4"
                                style={{ width: 25, height: 25 }}
                                src={
                                  row?.company_image?.split('/')[4] == undefined
                                    ? splitUrl(row?.website_url) + '/favicon.ico'
                                    : row?.company_image
                                }
                              />
                              <strong
                                onClick={() => {
                                  handleShowCompany({
                                    disabled: true,
                                    id: row?.id,
                                    icon: row?.company_image,
                                  });
                                }}
                              >
                                {row?.name?.length > 15
                                  ? (row?.name).substring(0, 15 - 3) + '...'
                                  : row?.name}
                              </strong>
                            </div>
                          </StyledTableCell>
                          <StyledTableCell style={{ fontSize: 16 }}>
                            {row?.parent_company_details?.name}
                          </StyledTableCell>
                          <StyledTableCell style={{ fontSize: 16 }}>
                            <a
                              href={row.website_url}
                              style={{ textDecoration: 'underline' }}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {row?.website_url == null ? 'NA' : splitUrl(row?.website_url)}
                            </a>
                          </StyledTableCell>
                          <StyledTableCell style={{ fontSize: 16 }}>
                            {row?.industry?.length > 15
                              ? (row?.industry).substring(0, 15 - 3) + '...'
                              : row?.industry}
                          </StyledTableCell>
                          <StyledTableCell
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              marginTop: 10,
                              height: 35,
                            }}
                          >
                            {!switchedValue && (
                              <div
                                className="mr-4"
                                onClick={() =>
                                  handleOpen({
                                    edit: true,
                                    id: row?.id,
                                    company_name: row?.name,
                                    website_url: row?.website_url,
                                    industry: row?.industry,
                                    icon: row?.company_image,
                                    created_at: row?.created_at,
                                    parent_company: row?.parent_company,
                                  })
                                }
                              >
                                <Edit style={{ fontSize: 25, color: '#627daf' }} />
                              </div>
                            )}
                            <div
                              onClick={() =>
                                handleArchive({
                                  archive: switchedValue ? false : true,
                                  e: row?.id,
                                  company_name: row?.name,
                                  website_url: row?.website_url,
                                  industry: row?.industry,
                                  icon: row?.company_image,
                                  created_at: row?.created_at,
                                  parent_company: row?.parent_company,
                                })
                              }
                            >
                              <img
                                src={ArchiveIcon}
                                onMouseOver={(e) => (e.currentTarget.src = ArchiveDanger)}
                                onMouseOut={(e) => (e.currentTarget.src = ArchiveIcon)}
                                style={{ width: 20, height: 20 }}
                              />
                            </div>
                          </StyledTableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-centre">
                    <strong>No Record(s) found!</strong>
                  </div>
                )}
              </TableContainer>
            )}
          </>
        ) : (
          <CompanyUsers
            filteredData={activeUsers || []}
            showSearch
          />
        )}
      </>
      <AddNewCompany
        open={open}
        data={editData}
        handleClose={handleClose}
      />
      <ArchiveDialog
        open={openArchive}
        archive={switchedValue}
        archiveData={dataForArchive}
        handleClose={closeArchive}
      />
      <CompanyDetails
        open={showCompany}
        data={editData}
        handleClose={handleCloseCompany}
      />
    </>
  );
}

export default React.memo(CompaniesTable);
