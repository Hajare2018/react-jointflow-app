import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import PropTypes from 'prop-types';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Loader';
import '../Documents/DocumentsLibrary/document.css';
import {
  Avatar,
  FormControlLabel,
  IconButton,
  Switch,
  TableSortLabel,
  Tooltip,
} from '@mui/material';
import AddNewUser from '../Users/AddNewUser';
import {
  BusinessOutlined,
  CheckCircleOutlined,
  Edit,
  HighlightOffOutlined,
  InsertLinkOutlined,
  MoreVertOutlined,
  RefreshRounded,
} from '@mui/icons-material';
import DeActivateUserDialog from '../Users/DeactivateUserDialog';
import { createImageFromInitials } from '../Utils';
import SearchBar from '../../component-lib/SearchBar/SearchBar';
import { getAllUsers, requestGroupViewLink } from '../../Redux/Actions/user-info';
import { show } from '../../Redux/Actions/loader';
import CopyIcon from '../../assets/icons/copy-outline-icon.svg';
import { showInfoSnackbar } from '../../Redux/Actions/snackbar';
import { requestCompanyAccess } from '../../Redux/Actions/companies';
import MenuPopover from '../MenuPopover';
import MaapLinkModal from '../ProjectForm/MaapLinkModal';
import { stableSort, getComparator } from '../../component-lib/JFTable/JFTable';

const headCells = [
  {
    id: 'first_name',
    numeric: false,
    disablePadding: false,
    label: 'First Name',
  },
  {
    id: 'last_name',
    numeric: false,
    disablePadding: false,
    label: 'Last Name',
  },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'phone_number', numeric: false, disablePadding: false, label: 'Phone' },
  { id: 'role', numeric: false, disablePadding: false, label: 'Role' },
  { id: 'company', numeric: false, disablePadding: false, label: 'Company' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
];

const headCellsWithoutCompany = [
  {
    id: 'first_name',
    numeric: false,
    disablePadding: false,
    label: 'First Name',
  },
  {
    id: 'last_name',
    numeric: false,
    disablePadding: false,
    label: 'Last Name',
  },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'phone_number', numeric: false, disablePadding: false, label: 'Phone' },
  { id: 'role', numeric: false, disablePadding: false, label: 'Role' },
  { id: 'actions', numeric: false, disablePadding: false, label: 'Actions' },
];
function EnhancedTableHead({ classes, order, orderBy, onRequestSort, showCompany }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {(showCompany ? headCells : headCellsWithoutCompany).map((headCell) => (
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
    fontSize: '14px !important',
    padding: 5,
    width: '16%',
  },
  body: {
    fontSize: 16,
    padding: 5,
    border: `0px`,
  },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
  root: {
    '&:nth-of-type(even)': {
      backgroundColor: '#f5f5f5',
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: '100%',
    height: 40,
  },
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    maxHeight: `65vh`,
    '@media(max-height: 1080px)': {
      maxHeight: 825,
    },
    '@media(max-height: 1024px)': {
      maxHeight: 830,
    },
    '@media(max-height: 900px)': {
      maxHeight: 715,
    },
    '@media(max-height: 768px)': {
      maxHeight: 510,
    },
  },
});

const menuItemArr = [
  {
    id: 1,
    label: 'Invite to group view',
    icon: <BusinessOutlined style={{ color: '#627daf' }} />,
  },
  {
    id: 2,
    label: 'Copy Group View Link',
    icon: <InsertLinkOutlined className="link-icon" />,
  },
];

function CompanyUsers({ filteredData, showSearch, filterByCompanies }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [switchedValue, setSwitchedValue] = useState(false);
  const [deActivateData, setDeactivateData] = useState([]);
  const [editData, setEditData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [searched, setSearched] = useState('');
  const [rows, setRows] = useState(null);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('first_name');
  const [allRows, setAllRows] = useState([]);
  const [userData, setUserData] = useState(null);

  const handleConfirmDialog = (e) => {
    setDeactivateData(e);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpen = (e) => {
    setEditData(e);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const loader = useSelector((state) => state.showLoader);
  const allUsersData = useSelector((state) => state.allLightUsersData);
  const allUsers = allUsersData?.data?.length > 0 ? allUsersData?.data : [];

  const requestSearch = (searchedVal) => {
    const filteredRows = (allRows || [])?.filter((row) => {
      return row.first_name.toLowerCase().includes(searchedVal?.toLowerCase());
    });
    setRows(filteredRows);
  };

  useEffect(() => {
    allUsers?.forEach((element) => {
      element.company = element?.light_buyer_company_details?.name;
    });
    setAllRows(allUsers);
  }, [allUsersData, filterByCompanies]);

  useEffect(() => {
    setSwitchedValue(switchedValue);
  }, [switchedValue]);

  const cancelSearch = () => {
    setSearched('');
    requestSearch(searched);
  };

  const handleSwitch = () => {
    setSwitchedValue(!switchedValue);
    if (switchedValue) {
      dispatch(getAllUsers({ onlyStaff: false }));
    } else {
      dispatch(getAllUsers({ onlyStaff__archived: false }));
    }
  };

  const doRefresh = () => {
    dispatch(show(true));
    if (switchedValue) {
      dispatch(getAllUsers({ onlyStaff__archived: false }));
    } else {
      dispatch(getAllUsers({ onlyStaff: false }));
    }
  };

  useEffect(() => {
    if (!filterByCompanies) {
      doRefresh();
    }
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleCopy = (email) => {
    navigator.clipboard.writeText(email);
    dispatch(showInfoSnackbar('Copied to clipboard!'));
  };

  const handleCompanyAccess = (id) => {
    const reqBody = {
      user_id: id,
    };
    dispatch(requestCompanyAccess({ data: reqBody }));
  };

  const handleClick = (event, data) => {
    setUserData(data);
    setAnchorEl(event.currentTarget);
  };

  const handleClickMenuItem = (id) => {
    if (id == 1) {
      handleCompanyAccess(userData?.id);
    } else if (id == 2) {
      dispatch(
        requestGroupViewLink({
          company_id: userData.light_buyer_company_details.id,
          user_id: userData.id,
        }),
      );
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <>
        {showSearch && (
          <div className="d-flex-wrap justify-space-around w-100">
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
                  />
                }
                label={
                  <span>{switchedValue ? 'Hide Deactived Users' : 'Show Deactived Users'}</span>
                }
              />
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
        )}
        <TableContainer className={`${classes.container} tableWrap`}>
          {loader.show ? (
            <Loader />
          ) : !allRows?.length ? (
            <div className="d-flex justify-centre mt-3">
              <strong>No Record(s) Found!</strong>
            </div>
          ) : (
            <Table
              className={classes.table}
              stickyHeader
            >
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                showCompany={showSearch}
              />
              <TableBody>
                {stableSort(rows?.length > 0 ? rows : allRows, getComparator(order, orderBy)).map(
                  (row) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell
                        component="th"
                        scope="row"
                        style={{
                          color: row?.is_active ? '#000000' : '#aeaeae',
                        }}
                      >
                        <div className="d-flex">
                          <Avatar className="h-7 w-7 mr-1">
                            <img
                              src={
                                row?.avatar === null
                                  ? createImageFromInitials(
                                      300,
                                      row?.first_name + ' ' + row?.last_name,
                                      '#627daf',
                                    )
                                  : row?.avatar
                              }
                              className="h-7 w-7"
                              loading="lazy"
                            />
                          </Avatar>
                          {(row?.first_name).length > 25
                            ? (row?.first_name).substring(0, 25 - 3) + '...'
                            : row?.first_name}
                        </div>
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{
                          color: row?.is_active ? '#000000' : '#aeaeae',
                        }}
                      >
                        {(row?.last_name).length > 25
                          ? (row?.last_name).substring(0, 25 - 3) + '...'
                          : row?.last_name}
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{
                          color: row?.is_active ? '#000000' : '#aeaeae',
                        }}
                      >
                        <div className="flex">
                          <a
                            type="button"
                            href={'mailto:' + row?.email}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <u>
                              {(row?.email).length > 18
                                ? (row?.email).substring(0, 18 - 3) + '...'
                                : row?.email}
                            </u>
                          </a>
                          <img
                            src={CopyIcon}
                            onClick={() => handleCopy(row.email)}
                            className="h-4 w-4 text-black"
                          />
                        </div>
                      </StyledTableCell>
                      <StyledTableCell>
                        {row.phone_number == null ? (
                          <p>Unknown</p>
                        ) : (
                          <a
                            type="button"
                            href={'tel:' + row?.phone_number}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <u>{row.phone_number == 'undefined' ? 'Unknown' : row.phone_number}</u>
                          </a>
                        )}
                      </StyledTableCell>
                      <StyledTableCell
                        align="left"
                        style={{
                          color: row?.is_active ? '#000000' : '#aeaeae',
                        }}
                      >
                        {row?.role}
                      </StyledTableCell>
                      {showSearch && (
                        <StyledTableCell
                          align="left"
                          style={{
                            color: row?.is_active ? '#000000' : '#aeaeae',
                          }}
                        >
                          {row?.company}
                        </StyledTableCell>
                      )}
                      <StyledTableCell
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginTop: 10,
                          color: row?.is_active ? '#000000' : '#aeaeae',
                        }}
                      >
                        {row?.is_active ? (
                          <>
                            <div
                              style={{ cursor: 'pointer', marginRight: 10 }}
                              onClick={() =>
                                handleOpen({
                                  id: row?.id,
                                  first_name: row?.first_name,
                                  last_name: row?.last_name,
                                  email: row?.email,
                                  company_name: row?.buyer_company_details?.name,
                                  role: row?.role,
                                  is_staff: row?.is_staff,
                                  is_active: row?.is_active,
                                  user_type: row?.user_type,
                                  data_joined: row?.date_joined,
                                  company_id: row?.buyer_company_details?.id,
                                  linkedin_url: row?.linkedin_url,
                                  phone_number: row?.phone_number,
                                  avatar: row?.avatar,

                                  disabled: filteredData?.length > 0 ? true : false,
                                })
                              }
                            >
                              <Edit style={{ fontSize: 25, color: '#627daf' }} />
                            </div>
                            <div
                              style={{ cursor: 'pointer' }}
                              onClick={() =>
                                handleConfirmDialog({
                                  deactivate: true,
                                  id: row?.id,
                                  first_name: row?.first_name,
                                  last_name: row?.last_name,
                                  email: row?.email,
                                  company_name: row?.buyer_company_details?.name,
                                  role: row?.role,
                                  user_type: row?.user_type,
                                  data_joined: row?.date_joined,
                                  company_id: row?.buyer_company_details?.id,
                                  linkedin_url: row?.linkedin_url,
                                  phone_number: row?.phone_number,
                                  avatar: row?.avatar,
                                  is_staff: row?.is_staff,
                                  is_active: row?.is_active,
                                })
                              }
                            >
                              <HighlightOffOutlined style={{ fontSize: 30, color: 'red' }} />
                            </div>
                            <div
                              style={{ cursor: 'pointer', marginLeft: 4 }}
                              onClick={(event) => handleClick(event, row)}
                            >
                              <MoreVertOutlined />
                            </div>
                          </>
                        ) : (
                          <div
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                              handleConfirmDialog({
                                deactivate: false,
                                id: row?.id,
                                first_name: row?.first_name,
                                last_name: row?.last_name,
                                email: row?.email,
                                company_name: row?.buyer_company_details?.name,
                                role: row?.role,
                                user_type: row?.user_type,
                                data_joined: row?.date_joined,
                                company_id: row?.buyer_company_details?.id,
                                linkedin_url: row?.linkedin_url,
                                phone_number: row?.phone_number,
                                avatar: row?.avatar,
                                is_staff: row?.is_staff,
                                is_active: row?.is_active,
                              })
                            }
                          >
                            <CheckCircleOutlined style={{ fontSize: 30, color: 'green' }} />
                          </div>
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  ),
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
      </>
      <MenuPopover
        data={menuItemArr}
        anchorEl={anchorEl}
        handleClose={handleCloseMenu}
        getClicked={handleClickMenuItem}
      />
      <AddNewUser
        open={open}
        forEdit={editData}
        handleClose={handleClose}
        forCompany
      />
      <DeActivateUserDialog
        open={openConfirm}
        handleClose={handleCloseConfirm}
        data={deActivateData}
        forUsers
      />
      <MaapLinkModal
        open={showModal}
        assignee={userData?.first_name + ' ' + userData?.last_name}
        handleClose={closeModal}
      />
    </>
  );
}

export default React.memo(CompanyUsers);
