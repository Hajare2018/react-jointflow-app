import {
  Avatar,
  FormControlLabel,
  Switch,
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
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FaIndustry } from 'react-icons/fa';
import {
  createImageFromInitials,
  dateFormat,
  findPercentage,
  getForecastStatus,
} from '../../../Utils';
import { useDispatch, useSelector } from 'react-redux';
import AppProgressbar from '../../../AppProgressbar';
import Loader from '../../../Loader';
import SearchBar from '../../../../component-lib/SearchBar/SearchBar';
import { setMessage } from '../../../../Redux/Actions/loader';
import HttpClient from '../../../../Api/HttpClient';
import { fetchData } from '../../../../Redux/Actions/store-data';
import { stableSort, getComparator } from '../../../../component-lib/JFTable/JFTable';

const headCells = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'owner_name', numeric: true, disablePadding: false, label: 'Owner' },
  {
    id: 'target_close_date',
    numeric: true,
    disablePadding: false,
    label: 'Target Completion Date',
  },
  {
    id: 'forecast_status',
    numeric: true,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'left_tasks',
    numeric: true,
    disablePadding: false,
    label: 'Tasks Left',
  },
];

const closedHeadCells = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'owner_name', numeric: true, disablePadding: false, label: 'Owner' },
  {
    id: 'target_close_date',
    numeric: true,
    disablePadding: false,
    label: 'Target Completion Date',
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
    label: 'Status',
  },
  {
    id: 'left_tasks',
    numeric: true,
    disablePadding: false,
    label: 'Tasks Left',
  },
];
function EnhancedTableHead({ order, orderBy, onRequestSort, closed }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {(closed ? closedHeadCells : headCells).map((headCell) => (
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
    maxHeight: `60vh`,
    overflowY: 'auto',
    '@media(max-height: 2160px)': {
      maxHeight: `64.4vh`,
    },
    '@media(max-height: 1080px)': {
      maxHeight: `64vh`,
    },
    '@media(max-height: 1024px)': {
      maxHeight: `57.3vh`,
    },
    '@media(max-height: 900px)': {
      maxHeight: `51.5vh`,
    },
    '@media(max-height: 768px)': {
      maxHeight: `39.5vh`,
    },
  },
}));

function TableComponent() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [searched, setSearched] = useState('');
  // TODO FIXME this seems strange that the rows are not used but the setRows is used
  // eslint-disable-next-line no-unused-vars
  const [rows, setRows] = useState(null);
  const [closed, setClosed] = useState(false);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('target_close_date');
  const companyData = useSelector((state) => state.groupViewData);
  const stored = useSelector((state) => state.storedData);
  (companyData?.data?.group_projects || [])?.forEach((element) => {
    element.left_cards = element.total_cards - element.total_closed_cards;
  });
  const closed_projects = companyData?.data?.group_projects?.filter((item) => item.closed == true);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  useEffect(() => {
    setRows(companyData?.data?.group_projects);
    dispatch(fetchData(companyData?.data?.group_projects));
  }, [companyData]);

  const handleSwitch = () => {
    if (closed) {
      setRows(companyData?.data?.group_projects);
      dispatch(fetchData(companyData?.data?.group_projects));
    } else {
      setRows(closed_projects);
      dispatch(fetchData(closed_projects));
    }
    setClosed(!closed);
  };

  const requestSearch = (searchedVal) => {
    const filteredRows = companyData?.data?.group_projects?.filter((row) => {
      return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    if (!filteredRows.length) {
      dispatch(setMessage('No Record(s) found!'));
    }
    setRows(filteredRows);
  };

  const cancelSearch = () => {
    setSearched('');
    requestSearch(searched);
  };

  const handleOpen = (task, board) => {
    window.open(
      `/task_review/?task_id=${task}&board=${board}&jt=${HttpClient.api_token()}`,
      '_blank',
    );
  };
  return (
    <>
      <div
        style={{ position: 'sticky', top: 0 }}
        className="d-flex justify-space-between"
      >
        <SearchBar
          className="search-bar search"
          value={searched}
          onChange={(searchVal) => requestSearch(searchVal)}
          onCancelSearch={() => cancelSearch()}
        />
        <Tooltip
          title={(closed ? 'Hide' : 'Show') + 'Closed Projects'}
          placement="bottom"
          arrow
        >
          <FormControlLabel
            style={{ float: 'right', marginLeft: 10 }}
            control={
              <Switch
                checked={closed}
                onChange={handleSwitch}
                name="checkedA"
              />
            }
            label={<span>{closed ? 'Hide' : 'Show'} Closed Projects</span>}
          />
        </Tooltip>
      </div>
      <TableContainer className={classes.container}>
        {companyData?.data?.group_projects?.length === 0 ? (
          <div
            className="d-flex justify-centre"
            style={{ marginTop: 200 }}
          >
            <h4>No Record(s) found!</h4>
          </div>
        ) : companyData?.data?.group_projects?.length > 0 ? (
          <Table
            className={classes.table}
            stickyHeader
          >
            {stored?.data?.length > 0 && (
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                closed={closed}
              />
            )}
            <TableBody>
              {stableSort(
                stored?.data?.length > 0 ? stored?.data : [],
                getComparator(order, orderBy),
              ).map((row) => {
                return (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell
                      className="d-flex"
                      style={{ height: 50, cursor: 'pointer' }}
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
                          onClick={() => handleOpen(row?.first_card_id, row?.id)}
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
                    <StyledTableCell align="right">{row?.owner_name}</StyledTableCell>
                    <StyledTableCell align="right">
                      {dateFormat(new Date(row?.target_close_date))}
                    </StyledTableCell>
                    {closed && (
                      <StyledTableCell align="right">
                        {row?.board_likely_end_date == null && row?.actual_close_date == null
                          ? 'Unavailable'
                          : row?.actual_close_date !== null
                            ? dateFormat(new Date(row?.actual_close_date))
                            : dateFormat(new Date(row?.board_likely_end_date))}
                      </StyledTableCell>
                    )}
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
                            marginLeft: '1rem',
                          }}
                        >
                          {row?.left_cards}/{row?.total_cards}
                        </strong>
                      </Tooltip>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <Loader />
        )}
      </TableContainer>
    </>
  );
}

export default React.memo(TableComponent);
