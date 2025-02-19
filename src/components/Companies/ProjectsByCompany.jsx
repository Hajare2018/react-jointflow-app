import React from 'react';
import { FaChartPie, FaFileAlt, FaIndustry, FaPoundSign } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  createImageFromInitials,
  currencyFormatter,
  dateFormat,
  getCurrencySymbol,
  getForecastStatus,
} from '../Utils';
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
import { makeStyles, withStyles } from '@mui/styles';
import { getAllUsers } from '../../Redux/Actions/user-info';
import { completed } from '../../Redux/Actions/completed-value';
import { show } from '../../Redux/Actions/loader';
import requestSingleProject from '../../Redux/Actions/single-project';
import { getConnectedCrms } from '../../Redux/Actions/crm-data';
import Dashboard from '../../pages/Dashboard';
import {
  ArchiveOutlined,
  EditOutlined,
  LaunchOutlined,
  MoreVertOutlined,
  PersonAddOutlined,
  TableChartOutlined,
} from '@mui/icons-material';
import MenuPopover from '../MenuPopover';
import { stableSort, getComparator } from '../../component-lib/JFTable/JFTable';
import { useTenantContext } from '../../context/TenantContext';

const headCells = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'project_value', numeric: true, disablePadding: false, label: 'Value' },
  { id: 'owner_name', numeric: true, disablePadding: false, label: 'Owner' },
  {
    id: 'target_close_date',
    numeric: true,
    disablePadding: false,
    label: 'Target Close Date',
  },
  {
    id: 'actual_close_date',
    numeric: true,
    disablePadding: false,
    label: 'Actual End Date',
  },
  {
    id: 'forecast_status',
    numeric: true,
    disablePadding: false,
    label: 'Forecast Status',
  },
  {
    id: 'total_cards',
    numeric: true,
    disablePadding: false,
    label: '',
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
    padding: '0 10px 10px 10px',
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

const menuItemArr = [
  {
    id: 1,
    label: 'Open Project',
    icon: <EditOutlined style={{ color: '#627daf' }} />,
  },
  {
    id: 2,
    label: 'Open In New Tab',
    icon: <LaunchOutlined style={{ color: '#627daf' }} />,
  },
  {
    id: 3,
    label: 'Archive',
    icon: <ArchiveOutlined style={{ color: '#627daf' }} />,
  },
  {
    id: 4,
    label: 'Save As Template',
    icon: <TableChartOutlined style={{ color: '#627daf' }} />,
  },
  {
    id: 5,
    label: 'Reassign',
    icon: <PersonAddOutlined style={{ color: '#627daf' }} />,
  },
];

function ProjectsByCompany() {
  let projectsValue = [];
  const classes = useStyles();
  const dispatch = useDispatch();
  const [board, setBoard] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('target_close_date');
  const projects = useSelector((state) => state.ProjectsByCompanyData);
  const allData = projects?.data?.length > 0 ? projects?.data : [];
  allData.forEach((element) => {
    projectsValue.push(element.project_value);
  });

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const { tenant_locale, currency_symbol, slack_integrated } = useTenantContext();

  const handleOpen = (e) => {
    dispatch(show(true));
    setBoard(e);
    dispatch(completed(e.id));
    setOpen(true);
    checkSlackConnection();
    dispatch(requestSingleProject({ id: e.id, header: true }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = (event, data) => {
    setBoard(data);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClickMenuItem = (id) => {
    if (id == 1) {
      handleOpen(board);
    } else if (id == 2) {
      checkSlackConnection();
      window.open(`/board/?id=${board?.id}&navbars=True&actions=True`, '_blank');
    } else if (id == 3) {
      //   handleArchive({ close: false });
    } else if (id == 4) {
      dispatch(requestSingleProject({ id: board?.id, header: true }));
      setTimeout(() => {
        dispatch(requestSingleProject({ id: board?.id }));
      }, 2000);
      // setSave(true);
    } else if (id == 5) {
      dispatch(getAllUsers({ onlyStaff: true }));
      // setShowusers(true);
    }
  };

  function checkSlackConnection() {
    return slack_integrated ? dispatch(getConnectedCrms({ crm: 'slack', fromBoard: true })) : '';
  }
  return (
    <>
      <div
        // className="overview"
        style={{
          position: 'sticky',
          top: 60,
          backgroundColor: '#f9fbfd',
          padding: '0 10px 0 10px',
          zIndex: 4,
        }}
      >
        <div
          id="analytics-card"
          className="analytics-card-container"
        >
          <div className="analytics-card analytics-card__one">
            <div className="analytics-card__content">
              <p>Total Open Projects</p>
              <h1>{allData?.length}</h1>
            </div>
            <div className="analytics-card__icon">
              <FaFileAlt
                size={32}
                color={'#3edab7'}
              />
            </div>
          </div>
          <div className="analytics-card analytics-card__two">
            <div className="analytics-card__content">
              <p>Total Value</p>
              <h1>
                {currencyFormatter(
                  tenant_locale,
                  projectsValue.reduce((a, b) => a + b, 0),
                  currency_symbol,
                )}
              </h1>
            </div>
            <div className="analytics-card__icon">
              <strong>
                {currency_symbol === null ? (
                  <FaPoundSign size={40} />
                ) : (
                  getCurrencySymbol(currency_symbol)
                )}
              </strong>
            </div>
          </div>
          <div className="analytics-card analytics-card__three">
            <div className="analytics-card__content">
              <p>Total Closed Projects</p>
              <h1>0</h1>
            </div>
            <div className="analytics-card__icon">
              <FaChartPie
                size={32}
                color={'#fc8c8a'}
              />
            </div>
          </div>
        </div>
      </div>
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
            {stableSort(allData, getComparator(order, orderBy)).map((row) => {
              return (
                <StyledTableRow key={row.id}>
                  <StyledTableCell
                    className="d-flex"
                    style={{ height: 50 }}
                  >
                    <Tooltip
                      title={
                        row?.buyer_company_details_light == null
                          ? 'No Company'
                          : row?.buyer_company_details_light?.name
                      }
                      placement={'top'}
                    >
                      {row?.buyer_company_details_light == null ? (
                        <Avatar style={{ height: 22, width: 22 }}>
                          <FaIndustry
                            style={{
                              color: '#627daf',
                              height: 18,
                              width: 18,
                            }}
                          />
                        </Avatar>
                      ) : (
                        <Avatar
                          style={{ height: 22, width: 22 }}
                          src={
                            row?.buyer_company_details_light?.company_image === null
                              ? createImageFromInitials(
                                  300,
                                  row?.buyer_company_details_light?.name,
                                  '#627daf',
                                )
                              : row?.buyer_company_details_light?.company_image
                          }
                        />
                      )}
                    </Tooltip>
                    <Tooltip
                      title={row?.name}
                      placement="top"
                      arrow
                    >
                      <h4
                        onClick={() => handleOpen(row)}
                        style={{
                          cursor: 'pointer',
                          color: '#6385b7',
                          fontWeight: '700',
                          marginLeft: 10,
                        }}
                      >
                        {row?.name?.length > 30
                          ? (row?.name).substring(0, 30 - 3) + '...'
                          : row?.name}
                      </h4>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {currencyFormatter(
                      tenant_locale,
                      row?.project_value == null ? 0 : row?.project_value,
                      currency_symbol,
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row?.owner_name}</StyledTableCell>
                  <StyledTableCell align="right">
                    {dateFormat(new Date(row?.target_close_date))}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row?.actual_close_date == null
                      ? 'NA'
                      : dateFormat(new Date(row?.actual_close_date))}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <strong
                      style={{
                        color: getForecastStatus(row.forecast_status),
                      }}
                    >
                      {row?.forecast_status?.charAt(0)?.toUpperCase() +
                        row?.forecast_status?.slice(1)}
                    </strong>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className="d-flex justify-space-between">
                      <Tooltip
                        title="Total Tasks"
                        placement="left"
                      >
                        <p className="red-circle">{row?.total_cards}</p>
                      </Tooltip>
                      <div
                        style={{ cursor: 'pointer' }}
                        onClick={(event) => handleClick(event, row)}
                      >
                        <MoreVertOutlined />
                      </div>
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Dashboard
        open={open}
        id={board?.id}
        handleClose={handleClose}
        close_boards={false}
        owner={board?.owner}
      />
      <MenuPopover
        data={menuItemArr}
        anchorEl={anchorEl}
        handleClose={handleCloseMenu}
        getClicked={handleClickMenuItem}
      />
    </>
  );
}

export default React.memo(ProjectsByCompany);
