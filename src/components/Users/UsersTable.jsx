import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../Redux/Actions/user-info';
import { show } from '../../Redux/Actions/loader';
import Loader from '../Loader';
import '../Documents/DocumentsLibrary/document.css';
import {
  Avatar,
  Fab,
  FormControlLabel,
  IconButton,
  Switch,
  TableSortLabel,
  Tooltip,
} from '@mui/material';
import AddNewUser from './AddNewUser';
import {
  Add,
  CheckCircleOutlined,
  Edit,
  HighlightOffOutlined,
  MailOutlineOutlined,
  MoreVertOutlined,
  RefreshRounded,
  SecurityOutlined,
  SendOutlined,
} from '@mui/icons-material';
import DeActivateUserDialog from './DeactivateUserDialog';
import { createImageFromInitials } from '../Utils';
import SearchBar from '../../component-lib/SearchBar/SearchBar';
import AssigneeCard from '../AssigneeCard';
import HierarchyIcon from '../../assets/icons/Hierarchy62Blue.png';
import { requestUserHierarchy } from '../../Redux/Actions/user-access';
import HierarchyModal from './HierarchyModal';
import MenuPopover from '../MenuPopover';
import { requestNewPassword, requestResetMFA } from '../../Redux/Actions/mfa';
import { sendResetPasswordMail } from '../../Redux/Actions/nudge-mail';
import { requestCompanyHierarchy } from '../../Redux/Actions/companies';
import { FaUserPlus } from 'react-icons/fa';
import AssigneeList from './AssigneeList';
import { stableSort, getComparator } from '../../component-lib/JFTable/JFTable';

const StyledTableCell = withStyles(() => ({
  head: {
    backgroundColor: '#eef2f6',
    color: '#000000',
    fontWeight: '700',
    whiteSpace: 'nowrap',
    overflow: `hidden !important`,
    textOverflow: 'ellipsis',
  },
  root: {
    padding: 12,
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

const headCells = [
  { id: 'first_name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'group', numeric: false, disablePadding: false, label: 'Access' },
  { id: 'role', numeric: false, disablePadding: false, label: 'Role' },
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
    height: 40,
  },
  container: {
    maxHeight: `calc(100vh - 318px)`,
  },
});

const menuItemArr = [
  {
    id: 1,
    label: 'Send Password in Email',
    icon: <SendOutlined style={{ color: '#627daf' }} />,
  },
  {
    id: 2,
    label: 'Send Password Reset Email',
    icon: <MailOutlineOutlined style={{ color: '#627daf' }} />,
  },
  {
    id: 3,
    label: 'Reset MFA',
    icon: <SecurityOutlined style={{ color: '#627daf' }} />,
  },
  {
    id: 4,
    label: 'Re-assign all projects',
    icon: <FaUserPlus style={{ color: '#627daf' }} />,
  },
  {
    id: 5,
    label: 'Organizational Chart',
    icon: (
      <img
        src={HierarchyIcon}
        style={{ width: 20, height: 20 }}
      />
    ),
  },
];

function UsersTable({ filteredData }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deActivateData, setDeactivateData] = useState([]);
  const [editData, setEditData] = useState([]);
  const [switchedValue, setSwitchedValue] = useState(false);
  const [searched, setSearched] = useState('');
  const [showUser, setShowUser] = useState(false);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('first_name');
  const [showHierarchy, setShowHierarchy] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [data, setData] = useState(null);
  const [rows, setRows] = useState([]);
  const [userList, setUserList] = useState(false);

  const handleClick = (event, data) => {
    setData(data);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClickMenuItem = (id) => {
    const formData = new FormData();
    formData.append('user_id', data?.id);
    if (id === 1) {
      dispatch(requestNewPassword({ data: formData }));
    }
    if (id === 2) {
      dispatch(sendResetPasswordMail({ data: formData }));
    }
    if (id === 3) {
      dispatch(requestResetMFA({ data: formData }));
    }
    if (id === 4) {
      setUserList(true);
    }
    if (id === 5) {
      showUserHierarchy(data?.id);
    }
  };

  const handleCloseList = () => {
    setUserList(false);
  };

  const handleConfirmDialog = (e) => {
    // dispatch(requestDocumentsData({ filterByTemplate: false }));
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

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [open]);

  const allUsersData = useSelector((state) => state.allUsersData);
  const allUsers = allUsersData.data.length > 0 ? allUsersData.data : [];
  const loader = useSelector((state) => state.showLoader);
  // eslint-disable-next-line no-unused-vars
  const [allRows, setAllRows] = useState([]);

  useEffect(() => {
    doRefresh();
  }, []);

  const handleSwitch = () => {
    setSwitchedValue(!switchedValue);
    if (switchedValue) {
      dispatch(getAllUsers({ onlyStaff: true }));
    } else {
      dispatch(getAllUsers({ onlyStaff__archived: true }));
    }
  };

  useEffect(() => {
    setAllRows(allUsers);
    setRows(allUsers);
  }, [allUsersData]);

  useEffect(() => {
    setSwitchedValue(switchedValue);
  }, [switchedValue]);

  const requestSearch = (searchedVal) => {
    const filteredRows = (allUsers || []).filter((row) => {
      return row.first_name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    if (filteredRows?.length > 0) {
      setRows(filteredRows);
    } else {
      setRows([]);
    }
  };

  const cancelSearch = () => {
    setSearched('');
    requestSearch(searched);
  };

  const handleShowUser = (e) => {
    if (e.setData) {
      setEditData(e);
      dispatch(requestCompanyHierarchy({ id: e?.data?.id }));
    } else {
      setEditData([]);
    }
    setShowUser(!showUser);
  };

  const doRefresh = () => {
    dispatch(show(true));
    if (switchedValue) {
      dispatch(getAllUsers({ onlyStaff__archived: true }));
    } else {
      dispatch(getAllUsers({ onlyStaff: true }));
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const showUserHierarchy = (id) => {
    dispatch(requestUserHierarchy({ user: id }));
    setShowHierarchy(true);
  };

  const closeUserHierarchy = () => {
    setShowHierarchy(false);
  };

  return (
    <>
      {loader.show ? (
        <div className="mt-3">
          <Loader />
        </div>
      ) : (
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
                    {switchedValue ? 'Hide Deactivated Users' : 'Display Deactivated Users'}
                  </span>
                }
              />
            </div>
            {!switchedValue ? (
              <div style={{ float: 'right' }}>
                <Tooltip
                  title="Add New User"
                  placement="top"
                  arrow
                >
                  <Fab
                    size="small"
                    onClick={() => handleOpen({ add: true })}
                    style={{ backgroundColor: '#627daf', color: '#ffffff' }}
                  >
                    <Add style={{ height: 30, width: 30 }} />
                  </Fab>
                </Tooltip>
              </div>
            ) : (
              ''
            )}
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
          <TableContainer className={classes.container}>
            {allUsers?.length > 0 ? (
              <Table
                className={classes.table}
                stickyHeader
              >
                {rows?.length > 0 ? (
                  <EnhancedTableHead
                    classes={classes}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                  />
                ) : (
                  <div className="text-centre">
                    <strong>No Record(s) found!</strong>
                  </div>
                )}
                <TableBody>
                  {stableSort(rows?.length > 0 ? rows : [], getComparator(order, orderBy)).map(
                    (row) => (
                      <StyledTableRow
                        style={{ color: row?.is_active ? '#000000' : '#aeaeae' }}
                        key={row.id}
                      >
                        <StyledTableCell scope="row">
                          <div
                            // onClick={() =>
                            //   handleShowUser({ setData: true, data: row })
                            // }
                            onClick={() =>
                              handleOpen({
                                edit: true,
                                id: row.id,
                                first_name: row.first_name,
                                last_name: row.last_name,
                                email: row.email,
                                company_name: row?.buyer_company_details?.name,
                                role: row.role,
                                is_staff: row?.is_staff,
                                is_active: row?.is_active,
                                user_type: row.user_type,
                                data_joined: row.date_joined,
                                company_id: row?.buyer_company_details?.id,
                                linkedin_url: row?.linkedin_url,
                                phone_number: row?.phone_number,
                                avatar: row?.avatar,
                                disabled: filteredData ? true : false,
                                reports_to: row?.reports_to,
                                access_group: row?.user_access_group,
                                target: row?.target_value,
                                email_opted_in: row?.email_opted_in,
                              })
                            }
                            style={{
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              color: '#6385b7',
                              marginLeft: 10,
                              textDecorationLine: 'underline',
                            }}
                          >
                            <Avatar
                              style={{ width: 22, height: 22, marginRight: 7 }}
                              src={
                                row?.avatar === null
                                  ? createImageFromInitials(
                                      300,
                                      row?.first_name + ' ' + row?.last_name,
                                      '#627daf',
                                    )
                                  : row?.avatar
                              }
                            />
                            {row?.first_name + ' ' + row?.last_name ||
                              ((row?.first_name === '' || row?.last_name === '') && 'Unknown')}
                          </div>
                        </StyledTableCell>
                        <StyledTableCell align="left">{row?.email}</StyledTableCell>
                        <StyledTableCell align="left">
                          {row?.user_access_group?.map((group) => group?.name)?.join(' | ')}
                        </StyledTableCell>
                        <StyledTableCell align="left">{row?.role}</StyledTableCell>
                        <StyledTableCell
                          style={{ display: 'flex' }}
                          align="left"
                        >
                          {!switchedValue ? (
                            <Tooltip
                              title="Edit"
                              placement="top"
                              arrow
                            >
                              <IconButton
                                onClick={() =>
                                  handleOpen({
                                    edit: true,
                                    id: row.id,
                                    first_name: row.first_name,
                                    last_name: row.last_name,
                                    email: row.email,
                                    company_name: row?.buyer_company_details?.name,
                                    role: row.role,
                                    is_staff: row?.is_staff,
                                    is_active: row?.is_active,
                                    user_type: row.user_type,
                                    data_joined: row.date_joined,
                                    company_id: row?.buyer_company_details?.id,
                                    linkedin_url: row?.linkedin_url,
                                    phone_number: row?.phone_number,
                                    avatar: row?.avatar,
                                    disabled: filteredData ? true : false,
                                    reports_to: row?.reports_to,
                                    access_group: row?.user_access_group,
                                    target: row?.target_value,
                                    email_opted_in: row?.email_opted_in,
                                  })
                                }
                              >
                                <Edit style={{ fontSize: 25, color: '#627daf' }} />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            ''
                          )}
                          {/* {row?.has_reports && (
                          <IconButton
                            onClick={() => showUserHierarchy(row?.id)}
                          >
                            <img
                              src={HierarchyIcon}
                              style={{ width: 20, height: 20 }}
                            />
                          </IconButton>
                        )} */}
                          {!switchedValue ? (
                            <>
                              <Tooltip
                                title="Deactivate User"
                                placement="top"
                                arrow
                              >
                                <IconButton
                                  onClick={() =>
                                    handleConfirmDialog({
                                      deactivate: true,
                                      id: row.id,
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
                                      reports_to: row?.reports_to,
                                      access_group: row?.user_access_group,
                                      target: row?.target_value,
                                    })
                                  }
                                >
                                  <HighlightOffOutlined style={{ fontSize: 30, color: 'red' }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip
                                title="More"
                                placement="top"
                                arrow
                              >
                                <IconButton onClick={(event) => handleClick(event, row)}>
                                  <MoreVertOutlined />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            <Tooltip
                              title="Activate User"
                              placement="top"
                              arrow
                            >
                              <IconButton
                                onClick={() =>
                                  handleConfirmDialog({
                                    deactivate: false,
                                    id: row.id,
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
                                    reports_to: row?.reports_to,
                                    access_group: row?.user_access_group,
                                    target: row?.target_value,
                                  })
                                }
                              >
                                <CheckCircleOutlined style={{ fontSize: 30, color: 'green' }} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            ) : (
              <div className="text-centre">
                <p>No Record(s) Found!</p>
              </div>
            )}
          </TableContainer>
        </>
      )}
      <MenuPopover
        data={data?.has_reports ? menuItemArr : menuItemArr.slice(0, -1)}
        anchorEl={anchorEl}
        handleClose={handleCloseMenu}
        getClicked={handleClickMenuItem}
      />
      <AddNewUser
        open={open}
        forEdit={editData}
        handleClose={handleClose}
      />
      <DeActivateUserDialog
        open={openConfirm}
        handleClose={handleCloseConfirm}
        data={deActivateData}
        forUsers={false}
      />
      <AssigneeCard
        open={showUser}
        handleClose={handleShowUser}
        dialogContent={editData}
      />
      <AssigneeList
        open={userList}
        handleClose={handleCloseList}
        user={data?.id}
      />
      <HierarchyModal
        open={showHierarchy}
        handleClose={closeUserHierarchy}
      />
    </>
  );
}

export default React.memo(UsersTable);
