import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import requestDocumentsData from '../Redux/Actions/documents-data';
import { Add } from '@mui/icons-material';
import PropTypes from 'prop-types';
import {
  Avatar,
  Fab,
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
import { FaIcons } from 'react-icons/fa';
import {
  createImageFromInitials,
  currencyFormatter,
  dateFormat,
  findPercentage,
  getForecastStatus,
} from '../components/Utils';
import AppProgressbar from '../components/AppProgressbar';
import { getConnectedCrms } from '../Redux/Actions/crm-data';
import { stableSort, getComparator } from '../component-lib/JFTable/JFTable';
import { useTenantContext } from '../context/TenantContext';

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
    id: 'board_likely_end_date',
    numeric: true,
    disablePadding: false,
    label: 'Projected End Date',
  },
  {
    id: 'forecast_status',
    numeric: true,
    disablePadding: false,
    label: 'Forecast Status',
  },
  {
    id: 'left_tasks',
    numeric: true,
    disablePadding: false,
    label: 'Tasks Left',
  },
  {
    id: '',
    numeric: false,
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
  fab: {
    backgroundColor: 'rgba(98,125, 175, 1.7)',
    margin: 0,
    top: 'auto',
    right: 35,
    bottom: 50,
    left: 'auto',
    zIndex: 9,
    position: 'fixed',
    '&:hover': {
      backgroundColor: '#3edab7',
    },
    '@media(max-width: 767px)': {
      right: 10,
      bottom: 10,
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

function CrmProjects() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('target_close_date');
  const path = new URL(window.location.href);
  const crm__id = new URLSearchParams(path.search).get('crm__id');
  const actions = new URLSearchParams(path.search).get('actions');
  const projects = useSelector((state) => state.crmProjectsData);
  const projectsData = projects?.data?.length > 0 ? projects?.data : [];
  projectsData.forEach((element) => {
    element.left_cards = element.total_cards - element.total_closed_cards;
  });

  const { tenant_locale, currency_symbol } = useTenantContext();

  useEffect(() => {
    dispatch(
      requestDocumentsData({
        fetch_crm_projects: true,
        crm_id: crm__id,
        project_type: null,
      }),
    );
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const openBoard = (id) => {
    dispatch(getConnectedCrms({ crm: 'slack', fromBoard: true }));
    window.open(`/board/?id=${id}&navback=True&navbars=False&actions=${actions}`, '_self');
  };

  const createProject = () => {
    window.open(`/create_project/?crm_id=${crm__id}&navbars=False`, '_self');
  };
  return (
    <>
      <main
        id="page"
        className="panel-view"
      >
        <div
          className="overview"
          style={{
            position: 'sticky',
            top: 70,
            backgroundColor: '#f9fbfd',
            zIndex: 4,
          }}
        >
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
                {stableSort(projectsData, getComparator(order, orderBy)).map((row) => {
                  return (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell
                        className="d-flex"
                        style={{ height: 50 }}
                      >
                        <Tooltip
                          title={
                            row?.buyer_company_details == null
                              ? 'No Company'
                              : row?.buyer_company_details?.name
                          }
                          placement={'top'}
                        >
                          {row?.buyer_company_details == null ? (
                            <Avatar style={{ height: 22, width: 22 }}>
                              <FaIcons.FaIndustry
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
                                row?.buyer_company_details?.company_image === null
                                  ? createImageFromInitials(
                                      300,
                                      row?.buyer_company_details?.name,
                                      '#627daf',
                                    )
                                  : row?.buyer_company_details?.company_image
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
                            onClick={() => openBoard(row.id)}
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
                        {row?.board_likely_end_date == null
                          ? 'Unavailable'
                          : dateFormat(new Date(row?.board_likely_end_date))}
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
                      <StyledTableCell
                        align="left"
                        className="d-flex"
                      >
                        <AppProgressbar
                          value={findPercentage(row?.total_closed_cards, row?.total_cards)}
                          forBoards
                        />
                        <Tooltip
                          title={`${findPercentage(
                            row?.total_closed_cards,
                            row?.total_cards,
                          )}% completed`}
                          placement="top"
                          arrow
                        >
                          <strong
                            style={{
                              float: 'left',
                              marginLeft: '1rem',
                            }}
                          >
                            {row?.left_cards}/{row?.total_cards}
                          </strong>
                        </Tooltip>
                      </StyledTableCell>
                      {/* <StyledTableCell>
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={(event) => handleClick(event, row)}
                      >
                        <MoreVertOutlined />
                      </div>
                    </StyledTableCell> */}
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </main>
      <Tooltip
        className="tour-project-add"
        title={'Create New Project'}
        placement="left"
        arrow
      >
        <Fab
          className={classes.fab}
          onClick={createProject}
          aria-label="add"
        >
          <Add
            style={{ width: 25, height: 25, color: '#ffffff' }}
            className="add-project"
          />
        </Fab>
      </Tooltip>
    </>
  );
}

export default React.memo(CrmProjects);
