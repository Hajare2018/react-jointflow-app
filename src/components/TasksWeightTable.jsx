import {
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditableElement from './EditableElement';
import editTaskData from '../Redux/Actions/update-task-info';
import { show } from '../Redux/Actions/loader';
import { VisibilityOffSharp, VisibilitySharp } from '@mui/icons-material';
import { updateProject } from '../Redux/Actions/create-project';
import { stableSort, getComparator } from '../component-lib/JFTable/JFTable';

const headCells = [
  { id: 'title', numeric: false, disablePadding: false, label: 'Task Name' },
  { id: 'weight', numeric: true, disablePadding: false, label: 'Weight' },
  {
    id: 'client_visible',
    numeric: true,
    disablePadding: false,
    label: 'External Visibility',
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
  },
  root: {
    padding: 8,
  },
  body: {
    fontSize: 16,
    height: 35,
    borderBottom: 0,
  },
  alignLeft: {
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
    padding: 15,
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
  forDashboard: {
    maxHeight: 'auto',
    padding: 15,
  },
}));

function TasksWeightTable({ forDashboard, is_group_enabled }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('start_date');
  const [taskWeight, setTaskWeight] = useState();
  const boardData = useSelector((state) => state.taskViewData);
  const tasks = boardData?.data?.length > 0 ? boardData?.data : [];
  const [allTasks, setAllTasks] = useState(null);
  const [isChecked, setIsChecked] = useState(is_group_enabled);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const handleText = (e) => {
    setTaskWeight(e);
  };
  const handleCheck = (e) => {
    setIsChecked(e.target.checked);
    const projectRequest = {
      display_group_maap: e.target.checked,
    };
    dispatch(
      updateProject({
        id: boardData?.data[0]?.board,
        data: projectRequest,
        closedBoards: false,
        is_crm: false,
      }),
    );
  };

  useEffect(() => {
    setAllTasks(tasks);
  }, [boardData]);

  const handleEditTable = (task) => {
    if (taskWeight !== null) {
      dispatch(show(true));
      dispatch(
        editTaskData({
          id: task?.id,
          board: boardData?.data[0]?.board,
          title: task?.title,
          weight: taskWeight,
          fetchCards: true,
        }),
      );
      return setTaskWeight(null);
    }
  };
  const handleTaskVisibility = (task) => {
    dispatch(show(true));
    dispatch(
      editTaskData({
        id: task?.id,
        board: boardData?.data[0]?.board,
        title: task?.title,
        client_visible: task?.client_visible ? false : true,
        fetchCards: true,
      }),
    );
  };
  return (
    <>
      {!allTasks?.length ? (
        <strong className="text-centre p-5">Loading...</strong>
      ) : (
        <TableContainer className={forDashboard ? classes.forDashboard : classes.container}>
          <FormControlLabel
            control={<Checkbox />}
            checked={isChecked}
            onChange={handleCheck}
            label="Display on Group Level View"
          />
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
              {stableSort(allTasks?.length > 0 && allTasks, getComparator(order, orderBy)).map(
                (row) => {
                  return (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell>{row?.title}</StyledTableCell>
                      <StyledTableCell align="right">
                        <EditableElement
                          onChange={handleText}
                          onBlur={(e) => {
                            if (e) {
                              if (isNaN(Number(taskWeight))) {
                                // TODO FIXME
                                // eslint-disable-next-line no-alert
                                alert('Task Weight should be a number!');
                              } else {
                                handleEditTable(row);
                              }
                            }
                          }}
                        >
                          <span className="mr-2">{row?.weight}</span>
                        </EditableElement>
                        ({Math.round(row?.weight_percentage * 100) + '%'})
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <div
                          className="cursor-pointer"
                          onClick={() => handleTaskVisibility(row)}
                        >
                          {row?.client_visible ? (
                            <VisibilitySharp style={{ color: 'green' }} />
                          ) : (
                            <VisibilityOffSharp style={{ color: 'red' }} />
                          )}
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                },
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}

export default React.memo(TasksWeightTable);
