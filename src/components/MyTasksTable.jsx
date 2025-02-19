import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import TableContainer from '@mui/material/TableContainer';
import { Avatar, Tooltip } from '@mui/material';
import {
  CalendarTodayOutlined,
  EditOutlined,
  LaunchOutlined,
  LibraryAddCheckOutlined,
  MessageOutlined,
  MoreVertOutlined,
} from '@mui/icons-material';
import AddToCalendarModal from './AddToCalendarModal';
import {
  createImageFromInitials,
  currencyFormatter,
  dateFormat,
  getStatusColor,
  getTaskStatus,
} from './Utils';
import AssigneeCard from './AssigneeCard';
import AllAssignees from './ProjectForm/Assignees';
import { useDispatch } from 'react-redux';
import { handleTabsChange } from '../Redux/Actions/tab-values';
import { getAllUsers } from '../Redux/Actions/user-info';
import SimpleBadge from './SimpleBadge';
import ArchiveIcon from '../assets/icons/archive.png';
import ArchiveDanger from '../assets/icons/archive_danger.png';
import MenuPopover from './MenuPopover';
import ConfirmDialog from './ProjectForm/Components/ConfirmDialog';
import editTaskData from '../Redux/Actions/update-task-info';
import getSingleTask from '../Redux/Actions/single-task';
import JFTable, { stableSort, getComparator } from '../component-lib/JFTable/JFTable';
import AttachFile from '../pages/Legal/AttachFile';
import { useTenantContext } from '../context/TenantContext';
import { useUserContext } from '../context/UserContext';

const tooltipStyles = makeStyles(() => ({
  customWidth: {
    maxWidth: 1200,
    borderRadius: '0.5rem',
  },
}));

export function Assignees({ external, internal, showInternals, card, handleAssignment }) {
  const classes = tooltipStyles();
  const [showAssignee, setShowAssignee] = useState(false);
  const [assignee, setAssignee] = useState([]);
  const handleShowAssignee = (e) => {
    if (e.data !== null) {
      setAssignee(e);
      setShowAssignee(!showAssignee);
    } else {
      return;
    }
  };
  return (
    <>
      <div>
        {showInternals ? (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() =>
              internal !== null ? handleShowAssignee({ data: internal, internal: true }) : ''
            }
          >
            <Tooltip
              classes={{ tooltip: classes.customWidth }}
              title={
                internal === null ? (
                  <div className="p-1">
                    <strong>This task is not assigned yet!</strong>
                  </div>
                ) : (
                  <div className="d-flex justify-centre p-3">
                    <div>
                      <Avatar
                        src={
                          (internal?.avatar === null ||
                            internal?.avatar?.split('/')?.[4] == 'undefined') &&
                          internal?.first_name !== 'undefined'
                            ? createImageFromInitials(
                                200,
                                internal?.first_name + ' ' + internal?.last_name,
                                '#6385b7',
                              )
                            : internal?.first_name == 'undefined'
                              ? ''
                              : internal?.avatar
                        }
                        style={{ height: 80, width: 80 }}
                      />
                    </div>
                    <div
                      style={{
                        height: 80,
                        width: 2,
                        backgroundColor: '#ffffff',
                        margin: 10,
                      }}
                    />
                    <div>
                      <h4>
                        <strong>Name: </strong>
                        {internal?.first_name + internal?.last_name}
                      </h4>
                      <h4>
                        <strong>Email: </strong> {internal?.email}
                      </h4>
                      <h4>
                        <strong>Phone: </strong>
                        {internal?.phone_number === 'false' ||
                        internal?.phone_number === '' ||
                        internal?.phone_number == 'undefined'
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
              {internal === null ? (
                <Avatar style={{ height: 20, width: 20, marginRight: 7 }}>
                  <strong
                    onClick={handleAssignment}
                    style={{ color: '#6385b7' }}
                  >
                    +
                  </strong>
                </Avatar>
              ) : (
                <Avatar
                  src={
                    (internal?.avatar === null ||
                      internal?.avatar?.split('/')?.[4] == 'undefined') &&
                    internal?.first_name !== 'undefined'
                      ? createImageFromInitials(
                          200,
                          internal?.first_name + ' ' + internal?.last_name,
                          '#6385b7',
                        )
                      : internal?.first_name == 'undefined'
                        ? ''
                        : internal?.avatar
                  }
                  style={{ height: 20, width: 20, marginRight: 7 }}
                />
              )}
            </Tooltip>
          </div>
        ) : (
          <Tooltip
            classes={{ tooltip: classes.customWidth }}
            title={
              external === null ? (
                <div className="p-1">
                  <strong>This task is not assigned yet!</strong>
                </div>
              ) : (
                <div className="d-flex justify-centre p-3">
                  <div>
                    <Avatar
                      src={
                        (external?.avatar === null ||
                          external?.avatar?.split('/')?.[4] == 'undefined') &&
                        external?.first_name !== 'undefined'
                          ? createImageFromInitials(
                              200,
                              external?.first_name + ' ' + external?.last_name,
                              '#6385b7',
                            )
                          : external?.first_name == 'undefined'
                            ? ''
                            : external?.avatar
                      }
                      style={{ height: 80, width: 80, marginRight: 7 }}
                    />
                  </div>
                  <div
                    style={{
                      height: 80,
                      width: 2,
                      backgroundColor: '#ffffff',
                      margin: 10,
                    }}
                  />
                  <div>
                    <h4>
                      <strong>Name: </strong>
                      {external?.first_name + external?.last_name}
                    </h4>
                    <h4>
                      <strong>Email: </strong> {external?.email}
                    </h4>
                    <h4>
                      <strong>Phone: </strong>
                      {external?.phone_number === 'false' ||
                      external?.phone_number === '' ||
                      external?.phone_number == 'undefined'
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
              onClick={() => handleShowAssignee({ data: external, external: true })}
            >
              <Avatar
                src={
                  external?.avatar === null
                    ? createImageFromInitials(
                        200,
                        external?.first_name + ' ' + external?.last_name,
                        '#6385b7',
                      )
                    : external?.first_name == 'undefined'
                      ? ''
                      : external?.avatar
                }
                style={{ height: 20, width: 20 }}
              />
            </div>
          </Tooltip>
        )}
      </div>
      <AssigneeCard
        open={showAssignee}
        handleClose={handleShowAssignee}
        dialogContent={assignee}
        card_id={card}
      />
    </>
  );
}

const menuItemArr = [
  {
    id: 1,
    label: 'Edit Task',
    icon: <EditOutlined style={{ color: '#627daf' }} />,
  },
  {
    id: 2,
    label: 'Open In New Tab',
    icon: <LaunchOutlined style={{ color: '#627daf' }} />,
  },
  {
    id: 3,
    label: 'Message',
    icon: <MessageOutlined style={{ color: '#627daf' }} />,
  },
  {
    id: 4,
    label: 'Add To Calendar',
    icon: <CalendarTodayOutlined style={{ color: '#627daf' }} />,
  },
  {
    id: 5,
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
];

function MyTasksTable({
  data,
  handleForm,
  locale,
  currency,
  hideContacts,
  taskFilter,
  task_type,
  selected_status,
  selected_type,
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState([]);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState(hideContacts ? 'board_priority' : 'end_date');
  const dispatch = useDispatch();

  const [showUsers, setShowUsers] = React.useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const { activate_steplist } = useTenantContext();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [row, setRow] = useState(null);
  const [showArchiveDialog, setShowArchiveDialog] = React.useState(false);
  const { user } = useUserContext();

  const handleClick = (event, data) => {
    setRow(data);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClickMenuItem = (id) => {
    if (id == 1) {
      handleEditTask(row, 0);
    } else if (id == 2) {
      window.open(
        `/board/?id=${row.boardId}&navbars=True&actions=True&card=${row.taskId}`,
        '_blank',
      );
    } else if (id == 3) {
      handleEditTask(row, 2);
    } else if (id == 4) {
      // dispatch(show(true));
      dispatch(getSingleTask({ card_id: row.taskId, task_info: false }));
      handleOpen({
        title: row.taskName,
        id: row.taskId,
        board: row.boardId,
      });
    } else if (id == 5) {
      handleShowArchiveDialog();
    }
  };

  const handleShowArchiveDialog = () => {
    setShowArchiveDialog(!showArchiveDialog);
  };

  const doArchive = (e) => {
    if (e.close) {
      handleArchive();
      handleShowArchiveDialog();
    } else {
      handleShowArchiveDialog();
    }
  };

  const handleArchive = () => {
    dispatch(
      editTaskData({
        id: row.taskId,
        board: row.boardId,
        archived: 'True',
        filterList: true,
        last_update_type: row.isCompleted ? 'Task re-opened' : 'Task Approved',
        status: selected_status,
        type: selected_type,
        userId: user.id,
      }),
    );
  };

  const handleShowUsers = (e) => {
    dispatch(getAllUsers({ onlyStaff: true }));
    setSelectedData(e);
    setShowUsers(true);
  };

  const handleCloseUsers = () => {
    setShowUsers(false);
  };

  const handleEditTask = (e, tabIndex) => {
    dispatch(handleTabsChange(tabIndex));
    handleForm(e, true);
  };

  const handleOpen = (e) => {
    setFormData(e);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const columns = [
    {
      id: 'board_name',
      label: 'Project',
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip
            title={row?.company?.name}
            placement="top"
          >
            <Avatar
              src={
                row?.company?.company_image === null
                  ? createImageFromInitials(300, row?.company?.name, '#627daf')
                  : row?.company?.company_image
              }
              style={{ height: 22, width: 22 }}
            />
          </Tooltip>
          <strong className="ml-2">{row?.board_name}</strong>
        </div>
      ),
    },
    {
      id: 'task_name',
      label: 'Task',
      align: 'left',
      cell: (row) => (
        <Tooltip
          title={row?.task_name}
          placement="top"
          arrow
        >
          <h4
            style={{
              cursor: 'pointer',
              color: '#6385b7',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
            }}
            onClick={() =>
              handleEditTask(
                {
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
                  attachments: row.attachments,
                  comments: row.comments,
                  company_id: row.company,
                  assignee_pic: row.assignee_pic,
                  internal_assignee: row.internal_assignee,
                  external_assignee: row.external_assignee,
                  buyer_company: row.company,
                  target_close_date: row.target_close_date,
                  color: row.taskColor,
                  owner: row.owner,
                  board_name: row.board_name,
                  show_board: true,
                  my_task: {
                    allCards: taskFilter === 'all',
                    completed: taskFilter === 'completed',
                    upcoming: taskFilter === 'upcoming',
                  },
                },
                0,
              )
            }
          >
            {row?.task_name.length > 30
              ? row?.task_name.substring(0, 30 - 3) + '...'
              : row?.task_name}
          </h4>
        </Tooltip>
      ),
    },
    {
      id: 'taskTypeName',
      label: 'Task Type',
      align: 'left',
      cell: (row) => row.task_type_name,
    },
    {
      id: 'start_date',
      label: 'Start',
      align: 'left',
      cell: (row) => dateFormat(row?.start_date),
    },
    ...(hideContacts
      ? [
          {
            id: 'end_date',
            label: 'End',
            align: 'left',
            cell: (row) => dateFormat(row?.end_date),
          },
          {
            id: 'owner',
            label: 'Owner',
            align: 'center',
            cell: (row) => row.owner,
          },
          {
            id: 'internal_assignee_name',
            label: 'Assignee',
            align: 'center',
            cell: (row) => (
              <Assignees
                card={row?.task_id}
                internal={row?.internal_assignee}
                showInternals
                handleAssignment={() => handleShowUsers(row)}
              />
            ),
          },
        ]
      : [
          {
            id: 'external_assignee_name',
            label: 'Contact',
            cell: (row) => (
              <Assignees
                card={row?.task_id}
                external={row?.external_assignee}
              />
            ),
          },
        ]),
    {
      id: 'project_value',
      label: 'Value',
      align: 'right',
      cell: (row) =>
        currencyFormatter(locale, row?.project_value === null ? 0 : row?.project_value, currency),
    },
    {
      id: 'board_priority',
      label: 'Priority',
      // align: 'right',
      cell: (row) => row.board_priority,
    },
    {
      id: 'attachment_count',
      label: 'Documents',
      align: 'left',
      cell: (row) =>
        row.attachment_count === 0 ? (
          <AttachFile add />
        ) : (
          <AttachFile
            data={row.attachments[0]}
            count={row.attachment_count}
          />
        ),
    },
    ...(activate_steplist && !hideContacts
      ? [
          {
            id: 'steps',
            label: 'Steps',
            align: 'right',
            cell: (row) => (
              <SimpleBadge
                icon={
                  <LibraryAddCheckOutlined
                    style={{
                      color:
                        getStatusColor(row.done_steps, row.steps) === 'nothing' ? '#999' : '#000',
                    }}
                  />
                }
                status={getStatusColor(row.done_steps, row.steps)}
                content={row.done_steps + '/' + row.steps}
              />
            ),
          },
        ]
      : []),
    {
      id: 'status',
      label: 'Status',
      align: 'left',
      cell: (row) => (
        <div className="d-flex">
          {getTaskStatus(row?.task_status, row?.start_date, row?.end_date)}
          <div
            className="more-options options"
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
                attachments: row.attachments,
                comments: row.comments,
                company_id: row.company,
                assignee_pic: row.assignee_pic,
                internal_assignee: row.internal_assignee,
                external_assignee: row.external_assignee,
                buyer_company: row.company,
                target_close_date: row.target_close_date,
                color: row.taskColor,
                owner: row.owner,
                board_name: row.board_name,
                show_board: true,
                my_task: {
                  allCards: taskFilter == 0,
                  completed: taskFilter == 1,
                  upcoming: taskFilter == 2,
                },
              })
            }
          >
            <MoreVertOutlined />
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <TableContainer style={{ height: '100%', maxHeight: 'calc(100vh - 96px - 214px)' }}>
        <JFTable
          data={stableSort(data, getComparator(order, orderBy))}
          columns={columns}
          onHeaderCellClick={handleRequestSort}
          orderedBy={orderBy}
          orderDirection={order}
          rowIdProp="task_id"
        />
      </TableContainer>
      <MenuPopover
        data={menuItemArr}
        anchorEl={anchorEl}
        handleClose={handleCloseMenu}
        getClicked={handleClickMenuItem}
      />
      {showArchiveDialog && (
        <ConfirmDialog
          open={showArchiveDialog}
          handleClose={doArchive}
          dialogTitle={`Archive ${row?.taskName}`}
          dialogContent={'Are you sure, you want to archive this task?'}
        />
      )}
      <AddToCalendarModal
        open={open}
        data={formData}
        handleClose={handleClose}
      />
      <AllAssignees
        open={showUsers}
        handleClose={handleCloseUsers}
        card={{ buyer_company: selectedData?.company }}
        recent_data={selectedData}
        assignment_type={{ internal: true }}
        history={false}
        updates={{
          task_type: task_type,
          allCards: taskFilter == 0,
          completed: taskFilter == 1,
          upcoming: taskFilter == 2,
        }}
      />
    </>
  );
}

export default React.memo(MyTasksTable);
