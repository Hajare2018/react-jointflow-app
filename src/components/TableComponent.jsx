import React, { useState } from 'react';
import { withStyles, makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Avatar, Chip, IconButton, Tooltip } from '@mui/material';
import {
  CheckCircleOutlineOutlined,
  ContentCopyOutlined,
  Edit,
  LaunchOutlined,
  LibraryAddCheckOutlined,
  MoreVertOutlined,
  OpenInBrowser,
  RestoreOutlined,
} from '@mui/icons-material';
import ArchiveIcon from '../assets/icons/archive.png';
import ArchiveDanger from '../assets/icons/archive_danger.png';
import {
  createImageFromInitials,
  formatDateTime,
  getPlurals,
  getStatusColor,
  getTaskStatus,
} from './Utils';
import AssigneeCard from './AssigneeCard';
import AssigneeDealPolice from './AssigneeDealPolice';
import { getTrends } from './HomePageComponents/Widget3/TaskByTypeTable';
import SimpleBadge from './SimpleBadge';
import MenuPopover from './MenuPopover';
import { useDispatch } from 'react-redux';
import editTaskData from '../Redux/Actions/update-task-info';
import ConfirmDialog from './ProjectForm/Components/ConfirmDialog';
import AttachFile from '../pages/Legal/AttachFile';
import { useTenantContext } from '../context/TenantContext';
import getSingleTask from '../Redux/Actions/single-task';
import { VisibilityButton } from './VisibilityButton';
import { useUserContext } from '../context/UserContext';
import DateRangePicker from './ProjectForm/DateRangePicker';
import { show } from '../Redux/Actions/loader';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#eef2f6',
    color: theme.palette.common.black,
    fontWeight: '700',
  },
  body: {
    fontSize: 14,
    height: 80,
    whiteSpace: 'nowrap',
    borderBottom: 0,
  },
  root: {
    padding: '16px 8px',
  },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
  root: {
    '&:nth-of-type(even)': {
      backgroundColor: '#f5f5f5',
    },
  },
}))(TableRow);

export function Assignees({ internal, external, card }) {
  const [showAssignee, setShowAssignee] = useState(false);
  const [assignee, setAssignee] = useState([]);
  const handleShowAssignee = (e) => {
    setAssignee(e);
    setShowAssignee(!showAssignee);
  };

  return (
    <div className="d-flex justify-center">
      <div className="mr-2">
        <Tooltip
          title={
            internal === null ? (
              <div className="p-1">
                <h4>
                  <strong>This task is not assigned yet!</strong>
                </h4>
              </div>
            ) : (
              <div className="d-flex-column justify-centre mt-3">
                <Avatar
                  src={
                    internal?.avatar === null ||
                    (internal?.avatar?.split('/')?.[4] === 'undefined' &&
                      internal?.first_name !== 'undefined')
                      ? createImageFromInitials(
                          200,
                          internal?.first_name + ' ' + internal?.last_name,
                          '#6385b7',
                        )
                      : internal?.first_name === 'undefined'
                        ? ''
                        : internal?.avatar
                  }
                  style={{ height: 150, width: 150, marginBottom: 10 }}
                />
                <div className="p-1">
                  <h4>
                    <strong>Name:</strong> {internal?.first_name + ' ' + internal?.last_name}
                  </h4>
                  <h4>
                    <strong>Email:</strong> {internal?.email}
                  </h4>
                  <h4>
                    <strong>Phone:</strong>{' '}
                    {internal?.phone_number === 'false' || internal?.phone_number === 'undefined'
                      ? 'Unknown'
                      : internal?.phone_number}
                  </h4>
                </div>
              </div>
            )
          }
          placement={'bottom'}
          arrow
        >
          <div
            style={{ cursor: 'pointer' }}
            onClick={() =>
              internal !== null ? handleShowAssignee({ data: internal, internal: true }) : ''
            }
          >
            <Avatar
              src={
                internal?.avatar === null ||
                (internal?.avatar?.split('/')?.[4] === 'undefined' &&
                  internal?.first_name !== 'undefined')
                  ? createImageFromInitials(
                      200,
                      internal?.first_name + ' ' + internal?.last_name,
                      '#6385b7',
                    )
                  : internal?.first_name === 'undefined'
                    ? ''
                    : internal?.avatar
              }
              style={{ width: 22, height: 22 }}
            />
          </div>
        </Tooltip>
      </div>
      <div>
        <Tooltip
          title={
            external === null ? (
              <div className="p-1">
                <strong>This task is not assigned yet!</strong>
              </div>
            ) : (
              <div className="d-flex-column justify-centre mt-3">
                <Avatar
                  src={
                    external?.avatar === null
                      ? createImageFromInitials(
                          200,
                          external?.first_name + ' ' + external?.last_name,
                          '#6385b7',
                        )
                      : external?.first_name === 'undefined'
                        ? ''
                        : external?.avatar
                  }
                  style={{ height: 150, width: 150, marginBottom: 10 }}
                />
                <div className="p-1">
                  <h4>
                    <strong>Name:</strong> {external?.first_name + ' ' + external?.last_name}
                  </h4>
                  <h4>
                    <strong>Email:</strong> {external?.email}
                  </h4>
                  <h4>
                    <strong>Phone:</strong>{' '}
                    {external?.phone_number === 'false' || external?.phone_number === 'undefined'
                      ? 'Unknown'
                      : external?.phone_number}
                  </h4>
                </div>
              </div>
            )
          }
          placement={'bottom'}
          arrow
        >
          <div
            style={{ cursor: 'pointer' }}
            onClick={() =>
              external !== null ? handleShowAssignee({ data: external, external: true }) : ''
            }
          >
            <Avatar
              src={
                external?.avatar === null ||
                (external?.avatar?.split('/')?.[4] === 'undefined' &&
                  external?.first_name !== 'undefined')
                  ? createImageFromInitials(
                      200,
                      external?.first_name + ' ' + external?.last_name,
                      '#6385b7',
                    )
                  : external?.first_name === 'undefined'
                    ? ''
                    : external?.avatar
              }
              style={{ width: 22, height: 22 }}
            />
          </div>
        </Tooltip>
      </div>
      <AssigneeCard
        open={showAssignee}
        handleClose={handleShowAssignee}
        dialogContent={assignee}
        card_id={card}
      />
    </div>
  );
}

const useStyles = makeStyles({
  table: {
    minWidth: '100%',
  },
  container: {
    maxHeight: `65vh`,
    '@media(max-height: 1080px)': {
      maxHeight: 685,
    },
    '@media(max-height: 1024px)': {
      maxHeight: 620,
    },
    '@media(max-height: 900px)': {
      maxHeight: 500,
    },
    '@media(max-height: 768px)': {
      maxHeight: 370,
    },
  },
});

export default function TableComponent({ data, handleForm, project_buyer_company, showExtra }) {
  data?.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  const classes = useStyles();
  const dispatch = useDispatch();
  const [datePicker, setDatePicker] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [row, setRow] = useState(null);
  const [prompt, showPrompt] = React.useState(false);
  const [promptContent, setPromptContent] = React.useState({
    type: '',
    title: '',
    content: '',
  });
  const { activate_steplist, activate_deal_police, internal_lock_activated } = useTenantContext();
  const { user: parsedData } = useUserContext();
  const hasAdminRole = parsedData?.user_access_group?.some((role) => role.name === 'Admin');

  const handleClick = (event, data) => {
    setRow(data);
    setAnchorEl(event.currentTarget);
  };

  const menuItemArr = [
    {
      id: 1,
      label: 'Edit Task',
      icon: <Edit className="text-[#6385b7]" />,
    },
    {
      id: 2,
      label: 'Open In New Tab',
      icon: <LaunchOutlined className="text-[#6385b7]" />,
    },
    {
      id: 3,
      label: 'Archive Task',
      icon: (
        <img
          src={ArchiveIcon}
          onMouseOver={(e) => (e.currentTarget.src = ArchiveDanger)}
          onMouseOut={(e) => (e.currentTarget.src = ArchiveIcon)}
          style={{ width: 20, height: 20 }}
        />
      ),
    },
    {
      id: 4,
      label: row?.isCompleted ? 'Reopen Task' : 'Mark as completed',
      icon: row?.isCompleted ? (
        <OpenInBrowser className="text-[#6385b7]" />
      ) : (
        <CheckCircleOutlineOutlined className="text-[#6385b7]" />
      ),
    },
    {
      id: 5,
      label: 'Clone Task',
      icon: <ContentCopyOutlined className="text-[#6385b7]" />,
    },
    {
      id: 6,
      label: 'Completed in the past',
      icon: <RestoreOutlined className="text-[#6385b7]" />,
    },
  ];

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClickMenuItem = (id) => {
    if (id === 1) {
      handleForm(row);
    }
    if (id === 2) {
      window.open(
        `/board/?id=${row.boardId}&navbars=True&actions=True&card=${row.taskId}`,
        '_blank',
      );
    }
    if (id === 3) {
      handleShowPrompt('archive');
    }
    if (id === 4) {
      handleTaskCompletion();
    }
    if (id === 5) {
      handleForm({ clone: true, data: row });
    }
    if (id === 6) {
      handleDatePicker();
    }
  };

  const handleDatePicker = () => {
    dispatch(show(true));
    dispatch(
      getSingleTask({
        card_id: row?.taskId,
        board_id: row?.boardId,
        task_info: true,
      }),
    );
    setDatePicker(!datePicker);
  };

  const handleShowPrompt = (type) => {
    showPrompt(true);
    if (type === 'archive') {
      setPromptContent({
        type: type,
        title: `Archive ${row?.taskName}`,
        content: 'Are you sure, you want to archive this task?',
      });
    } else if (type === 'visibility') {
      setPromptContent({
        type: type,
        title: 'Task Visibility',
        content: `Do you confirm you want to make this internal task visible to external contacts from ${project_buyer_company?.name}?`,
      });
    }
  };

  const handleClosePrompt = () => {
    showPrompt(false);
  };

  const handlePromptAction = (e) => {
    if (e.close) {
      if (promptContent.type === 'archive') {
        handleArchive();
      } else {
        handleTaskVisibility();
      }
    }
    handleClosePrompt();
  };

  const handleArchive = () => {
    dispatch(
      editTaskData({
        id: row.taskId,
        board: row.boardId,
        archived: 'True',
        task_info: true,
        last_update_type: row.isCompleted ? 'Task re-opened' : 'Task Approved',
      }),
    );
  };

  const handleTaskCompletion = () => {
    dispatch(
      editTaskData({
        id: row.taskId,
        board: row.boardId,
        is_completed: row.isCompleted ? false : true,
        forBoard: true,
      }),
    );
  };

  const handleTaskVisibility = () => {
    dispatch(
      editTaskData({
        id: row.task_id,
        board: row.board_id,
        client_visible: row?.client_visible ? false : true,
        forBoard: true,
      }),
    );
  };

  const path = new URL(window.location.href);
  const url = window.location.href;
  const isActions = new URLSearchParams(path.search).get('actions');
  const isProjects = url.includes('projects');

  return (
    <>
      {data ? (
        <TableContainer>
          <Table
            className={classes.table}
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <StyledTableCell />
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell align="left">Dates</StyledTableCell>
                <StyledTableCell align="center">Assignees</StyledTableCell>
                <Tooltip title="Defines whether this task is visible on the Mutual Action Plan">
                  <StyledTableCell align="center">Visibilty</StyledTableCell>
                </Tooltip>
                {activate_steplist && <StyledTableCell align="center">Steps</StyledTableCell>}
                {showExtra ? (
                  <>
                    {activate_deal_police && (
                      <StyledTableCell align="center">Deal Police</StyledTableCell>
                    )}
                    <StyledTableCell align="center">Doc</StyledTableCell>
                    <StyledTableCell align="center">Last Completion time</StyledTableCell>
                    <StyledTableCell align="center">Avg. Completion time</StyledTableCell>
                    <StyledTableCell align="center">Trends</StyledTableCell>
                  </>
                ) : (
                  ''
                )}
                <StyledTableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row) => (
                <StyledTableRow key={row.task_id}>
                  <StyledTableCell align="center">
                    {getTaskStatus(row.task_status, row.start_date, row.end_date)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {row.task_name.length > 35 ? (
                      <Tooltip
                        title={row.task_name}
                        placement="top"
                      >
                        <p
                          style={{
                            cursor: 'pointer',
                            color: '#6385b7',
                            fontWeight: '700',
                            fontStyle: 'italic',
                          }}
                          onClick={() =>
                            handleForm({
                              taskName: row.task_name,
                              taskType: row.task_type,
                              taskTypeName: row.task_type_name,
                              start_date: row.start_date,
                              end_date: row.end_date,
                              description: row.description,
                              edit: true,
                              taskId: row.task_id,
                              boardId: row.board_id,
                              isCompleted: row.task_status,
                              task_timing: row.task_timing,
                              attachments: row?.attachments,
                              doc_count: row?.attachment_count,
                              comments: row.comments,
                              company_id: row.company,
                              target_close_date: row.target_close_date,
                              assignee_pic: row.assignee_pic,
                              internal_assignee: row.internal_assignee,
                              external_assignee: row.external_assignee,
                              buyer_company: project_buyer_company,
                              color: row.taskColor,
                              owner: row.owner,
                            })
                          }
                        >
                          {row.task_name.substring(0, 35 - 3) + '...'}
                        </p>
                        <p>{row?.task_type_name}</p>
                      </Tooltip>
                    ) : (
                      <>
                        <p
                          style={{
                            cursor: 'pointer',
                            color: '#6385b7',
                            fontWeight: '700',
                            fontStyle: 'italic',
                          }}
                          onClick={() =>
                            handleForm({
                              taskName: row.task_name,
                              taskType: row.task_type,
                              taskTypeName: row.task_type_name,
                              start_date: row.start_date,
                              end_date: row.end_date,
                              description: row.description,
                              edit: true,
                              taskId: row.task_id,
                              boardId: row.board_id,
                              isCompleted: row.task_status,
                              task_timing: row.task_timing,
                              attachments: row?.attachments,
                              doc_count: row?.attachment_count,
                              comments: row.comments,
                              company_id: row.company,
                              target_close_date: row.target_close_date,
                              assignee_pic: row.assignee_pic,
                              internal_assignee: row.internal_assignee,
                              external_assignee: row.external_assignee,
                              buyer_company: project_buyer_company,
                              color: row.taskColor,
                              owner: row.owner,
                            })
                          }
                        >
                          {row.task_name}
                        </p>
                        <p>{row?.task_type_name}</p>
                      </>
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Tooltip
                      title={
                        formatDateTime(new Date(row.start_date), 'ddd d MMM yyyy') +
                        ' to ' +
                        formatDateTime(new Date(row.display_end_date), 'ddd d MMM yyyy')
                      }
                      placement="top"
                    >
                      <Chip
                        variant="default"
                        size="small"
                        label={
                          formatDateTime(new Date(row.start_date), 'd MMM') +
                          ' - ' +
                          formatDateTime(new Date(row.end_date), 'd MMM')
                        }
                      />
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Assignees
                      internal={row?.internal_assignee}
                      external={row?.external_assignee}
                      card={row?.task_id}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <VisibilityButton
                      isLockActivated={internal_lock_activated}
                      isAdmin={hasAdminRole}
                      row={row}
                      handleTaskVisibility={() => {
                        setRow(row);
                        if (row.side === 'internal' && !row.client_visible) {
                          handleShowPrompt('visibility');
                        } else {
                          handleTaskVisibility();
                        }
                      }}
                    />
                  </StyledTableCell>
                  {activate_steplist && (
                    <StyledTableCell align="center">
                      <SimpleBadge
                        icon={
                          <LibraryAddCheckOutlined
                            style={{
                              color:
                                getStatusColor(row.done_steps, row.steps) === 'nothing'
                                  ? '#999'
                                  : '#000',
                            }}
                          />
                        }
                        status={getStatusColor(row.done_steps, row.steps)}
                        content={row.done_steps + '/' + row.steps}
                      />
                    </StyledTableCell>
                  )}
                  {showExtra ? (
                    <>
                      {activate_deal_police && (
                        <StyledTableCell align="center">
                          <AssigneeDealPolice dealPolice={row?.deal_police} />
                        </StyledTableCell>
                      )}
                      <StyledTableCell align="center">
                        {row.attachment_count == undefined || row.attachment_count == 0 ? (
                          <AttachFile add />
                        ) : (
                          <AttachFile
                            data={row.attachments[0]}
                            count={row.attachment_count}
                          />
                        )}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {getPlurals(row?.last_completion_time, 'Day')}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {getPlurals(row?.avg_completion_time, 'Day')}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {getTrends(row?.last_completion_time, row?.avg_completion_time)}
                      </StyledTableCell>
                    </>
                  ) : (
                    ''
                  )}
                  <StyledTableCell align="center">
                    {(isActions == 'True' || isProjects) && (
                      <IconButton
                        onClick={(event) =>
                          handleClick(event, {
                            taskName: row.task_name,
                            taskType: row.task_type,
                            taskTypeName: row.task_type_name,
                            start_date: row.start_date,
                            end_date: row.end_date,
                            description: row.description,
                            edit: true,
                            taskId: row.task_id,
                            boardId: row.board_id,
                            isCompleted: row.task_status,
                            attachments: row?.attachments,
                            doc_count: row?.attachment_count,
                            comments: row.comments,
                            company_id: row.company,
                            assignee_pic: row.assignee_pic,
                            internal_assignee: row.internal_assignee,
                            external_assignee: row.external_assignee,
                            buyer_company: project_buyer_company,
                            color: row.taskColor,
                            owner: row.owner,
                          })
                        }
                      >
                        <MoreVertOutlined />
                      </IconButton>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
      <MenuPopover
        data={menuItemArr}
        anchorEl={anchorEl}
        handleClose={handleCloseMenu}
        getClicked={handleClickMenuItem}
      />
      <ConfirmDialog
        open={prompt}
        handleClose={handlePromptAction}
        dialogTitle={promptContent.title}
        dialogContent={promptContent.content}
      />
      <DateRangePicker
        open={datePicker}
        handleClose={() => setDatePicker(false)}
      />
    </>
  );
}
