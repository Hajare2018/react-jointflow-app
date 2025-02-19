import React, { useState } from 'react';
import { makeStyles, withStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  TrendingDownOutlined,
  TrendingFlatOutlined,
  TrendingUpOutlined,
} from '@mui/icons-material';
import { Avatar, Tooltip } from '@mui/material';
import newTab from '../../../assets/icons/OpenNewTabIconBlue.png';
import {
  createImageFromInitials,
  currencyFormatter,
  getPlurals,
  getTaskStatus,
  showTaskStatus,
} from '../../Utils';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ProjectForm from '../../ProjectForm/ProjectForm';
import { Assignees } from '../../TableComponent';
import getSingleTask from '../../../Redux/Actions/single-task';
import { requestTaskSteps } from '../../../Redux/Actions/task-info';
import { getAllUsers } from '../../../Redux/Actions/user-info';
import { getComments } from '../../../Redux/Actions/comments';
import { getSingleCardDocs } from '../../../Redux/Actions/document-upload';
import { useTenantContext } from '../../../context/TenantContext';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

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

export const getTrends = (duration1, duration2) => {
  return duration1 < duration2 ? (
    <TrendingDownOutlined style={{ color: '#91cf51' }} />
  ) : duration1 > duration2 ? (
    <TrendingUpOutlined style={{ color: '#ec7d31' }} />
  ) : duration1 === duration2 ? (
    <TrendingFlatOutlined style={{ color: '#ffbf00' }} />
  ) : (
    ''
  );
};

function Row(props) {
  const dispatch = useDispatch();
  const { tenant_locale, currency_symbol } = useTenantContext();
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const [showTask, setShowTask] = useState(false);
  const [tasks, setTasks] = useState(null);
  const handleOpen = (e) => {
    dispatch(getAllUsers({ onlyStaff: true }));
    dispatch(getComments({ id: e?.taskId }));
    dispatch(getSingleCardDocs({ doc_id: e?.taskId, archived: false }));
    dispatch(
      requestTaskSteps({
        id: e?.taskId,
        fetchByTaskType: false,
      }),
    );
    dispatch(
      getSingleTask({
        card_id: e?.taskId,
        board_id: e?.boardId,
        task_info: true,
      }),
    );
    setTasks(e);
    setShowTask(true);
    dispatch(getSingleTask({ card_id: e.taskId, task_info: true }));
  };
  const handleClose = () => {
    setShowTask(false);
  };

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell
          component="th"
          style={{ fontFamily: 'PoppinsBold' }}
          scope="row"
        >
          {row?.type?.custom_label}
        </StyledTableCell>
        <StyledTableCell>{row?.nb_open}</StyledTableCell>
        <StyledTableCell>{row?.nb_late}</StyledTableCell>
        <StyledTableCell>{getPlurals(row?.type?.last_completion_time, 'Day')}</StyledTableCell>
        <StyledTableCell>{getPlurals(row?.type?.last5_avg_completion_time, 'Day')}</StyledTableCell>
        <StyledTableCell>
          {getTrends(row?.type?.last_completion_time, row?.type?.last5_avg_completion_time)}
        </StyledTableCell>
      </TableRow>
      {open ? (
        <TableRow>
          <StyledTableCell
            className="p-0"
            colSpan={6}
          >
            <Collapse
              in={open}
              timeout="auto"
              unmountOnExit
            >
              <Box margin={1}>
                <Table
                  size="small"
                  className="mt-2"
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell>Assigned To</StyledTableCell>
                      <StyledTableCell>Value</StyledTableCell>
                      <StyledTableCell>Status</StyledTableCell>
                      <StyledTableCell>Action</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row?.tasks?.map((taskRow) => (
                      <TableRow key={taskRow?.id}>
                        <TableCell style={{ display: 'flex', alignItems: 'center' }}>
                          <Tooltip
                            title={taskRow?.light_company_details?.name}
                            placement="top"
                            arrow
                          >
                            <Avatar
                              className="mr-2"
                              style={{ width: 25, height: 25 }}
                            >
                              {taskRow?.light_company_details?.company_image === null ? (
                                createImageFromInitials(
                                  300,
                                  taskRow?.light_company_details?.name,
                                  '#627daf',
                                )
                              ) : (
                                <img
                                  src={taskRow?.light_company_details?.company_image}
                                  className="img-lazy-avatar"
                                  loading="lazy"
                                />
                              )}
                            </Avatar>
                          </Tooltip>
                          <strong
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                              handleOpen({
                                taskName: taskRow?.title,
                                taskType: taskRow?.task_type_details?.id,
                                taskTypeName: taskRow?.task_type_details?.name,
                                start_date: taskRow?.start_date,
                                end_date: taskRow?.end_date,
                                description: taskRow?.description,
                                edit: true,
                                taskId: taskRow?.id,
                                boardId: taskRow?.board,
                                isCompleted: taskRow?.is_completed,
                                comments: taskRow?.comments,
                                company_id: taskRow?.light_company_details?.id,
                                internal_assignee: taskRow?.internal_assignee_details,
                                external_assignee: taskRow?.external_assignee_details,
                                buyer_company: taskRow?.light_company_details,
                                color: taskRow?.task_type_details?.color,
                                owner: taskRow?.owner_details,
                                from_widget: true,
                                board_name: taskRow?.board_name,
                              })
                            }
                          >
                            {taskRow.title}
                          </strong>
                        </TableCell>
                        <TableCell>
                          <Assignees
                            internal={taskRow?.internal_assignee_details}
                            external={taskRow?.external_assignee_details}
                            card={taskRow?.id}
                          />
                        </TableCell>
                        <TableCell>
                          {currencyFormatter(
                            tenant_locale,
                            taskRow?.project_value,
                            currency_symbol,
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip
                            title={showTaskStatus(
                              taskRow?.is_completed,
                              taskRow?.start_date,
                              taskRow?.end_date,
                            )}
                            placement="right"
                          >
                            {getTaskStatus(
                              taskRow?.is_completed,
                              taskRow?.start_date,
                              taskRow?.end_date,
                            )}
                          </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                          <Link
                            to={`/board/?id=${taskRow.board}&navbars=True&actions=True&card=${taskRow.id}`}
                            target="_blank"
                          >
                            <Tooltip
                              title="Open in New Tab"
                              placement="top"
                              arrow
                            >
                              <img
                                src={newTab}
                                style={{ height: 15, width: 15 }}
                              />
                            </Tooltip>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </StyledTableCell>
        </TableRow>
      ) : (
        ''
      )}
      <ProjectForm
        open={showTask}
        handleClose={handleClose}
        formData={tasks}
        fromComponent="TaskByTypeTable"
        key={tasks ? tasks?.taskId : 'TaskByTypeTable'}
      />
    </React.Fragment>
  );
}

function TaskByTypeTable({ data }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <StyledTableCell />
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Open count</StyledTableCell>
            <StyledTableCell>Late count</StyledTableCell>
            <StyledTableCell>Last Completion time</StyledTableCell>
            <StyledTableCell>Avg. Completion time</StyledTableCell>
            <StyledTableCell>Trend</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row) => (
            <Row
              key={row?.[0]?.type?.id}
              row={row[0]}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default React.memo(TaskByTypeTable);
