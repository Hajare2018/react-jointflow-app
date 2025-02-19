import React, { useState } from 'react';
import { makeStyles } from '@mui/styles';
import TableContainer from '@mui/material/TableContainer';
import { Avatar, Tooltip } from '@mui/material';
import {
  CalendarTodayOutlined,
  EditOutlined,
  LaunchOutlined,
  MoreVertOutlined,
} from '@mui/icons-material';
import {
  createImageFromInitials,
  currencyFormatter,
  dateFormat,
  getTaskStatus,
} from '../../components/Utils';
import Assignees from '../../components/ProjectForm/Assignees';
import { useDispatch } from 'react-redux';
import { getAllUsers } from '../../Redux/Actions/user-info';
import ArchiveIcon from '../../assets/icons/archive.png';
import ArchiveDanger from '../../assets/icons/archive_danger.png';
import MenuPopover from '../../components/MenuPopover';
import ConfirmDialog from '../../components/ProjectForm/Components/ConfirmDialog';
import editTaskData from '../../Redux/Actions/update-task-info';
import getSingleTask from '../../Redux/Actions/single-task';
import { show } from '../../Redux/Actions/loader';
import JFTable, { getComparator, stableSort } from '../../component-lib/JFTable/JFTable';
import AttachFile from './AttachFile';
import TaskAssignees from './TaskAssignees';

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
    label: 'Add To Calendar',
    icon: <CalendarTodayOutlined style={{ color: '#627daf' }} />,
  },
  {
    id: 4,
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

const useStyles = makeStyles({
  table: {
    minWidth: '100%',
  },
  container: {
    maxHeight: 'calc(100vh - 302px)',
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
});

function LegalTasksTable({ data, handleForm, locale, currency, legalFilter, openCalendar }) {
  const dispatch = useDispatch();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('end_date');
  const [showUsers, setShowUsers] = React.useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [row, setRow] = useState(null);
  const [showArchiveDialog, setShowArchiveDialog] = React.useState(false);

  const columns = [
    {
      id: 'title',
      label: 'Name',
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip
            title={row?.light_company_details?.name}
            placement="top"
          >
            <Avatar
              src={
                row?.light_company_details?.company_image === null
                  ? createImageFromInitials(300, row?.light_company_details?.name, '#627daf')
                  : row?.light_company_details?.company_image
              }
              style={{ height: 25, width: 25 }}
            />
          </Tooltip>
          <Tooltip
            title={row?.title}
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
                marginLeft: 10,
              }}
              onClick={() =>
                handleEditTask({
                  edit: true,
                  taskId: row.id,
                  boardId: row.board,
                  board_name: row.board_name,
                  show_board: true,
                  is_legal: {
                    isLegal: legalFilter == 0,
                    isLegal__completed: legalFilter == 1,
                    isLegal__upcoming: legalFilter == 2,
                  },
                  show: true,
                })
              }
            >
              {row.title.length > 30 ? row.title.substring(0, 30 - 3) + '...' : row.title}{' '}
            </h4>
          </Tooltip>
        </div>
      ),
    },
    {
      id: 'taskTypeName',
      label: 'Task Type',
      cell: (row) => row.task_type_details?.custom_label,
    },
    {
      id: 'start_date',
      label: 'Dates',
      cell: (row) => `${dateFormat(row.start_date)} - ${dateFormat(row.end_date)}`,
      align: 'center',
    },
    {
      id: 'internal_assignee',
      label: 'Assignees',
      cell: (row) => (
        <TaskAssignees
          internal={row?.internal_assignee_light}
          external={row?.external_assignee_light}
          handleAssignment={() => handleShowUsers(row)}
        />
      ),
    },
    {
      id: 'owner_name',
      label: 'Owner',
      cell: (row) =>
        row.owner_details === null ? (
          ''
        ) : (
          <Tooltip
            title={row?.owner_details?.first_name + '-' + row?.owner_details?.last_name}
            placement="top"
          >
            <Avatar
              src={
                row?.owner_details?.avatar === null
                  ? createImageFromInitials(300, row?.owner_details?.first_name, '#627daf')
                  : row?.owner_details?.avatar
              }
              style={{ height: 20, width: 20 }}
            />
          </Tooltip>
        ),
    },
    {
      id: 'board_priority',
      label: 'Sales Priority',
      cell: (row) => row?.board_priority,
    },
    {
      id: 'project_value',
      label: 'Project Value',
      cell: (row) =>
        currencyFormatter(locale, row?.project_value === null ? 0 : row?.project_value, currency),
    },
    {
      id: 'attachment_count',
      label: 'Doc',
      cell: (row) =>
        row.nb_attachments === 0 ? (
          <AttachFile add />
        ) : (
          <AttachFile
            data={row.last_uploaded_document}
            count={row.nb_attachments}
          />
        ),
    },
    {
      id: 'end_date',
      label: 'Status',
      align: 'left',
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {getTaskStatus(row?.is_completed, row?.start_date, row?.end_date)}
          <div
            className="more-options options"
            onClick={(event) =>
              handleClick(event, {
                taskName: row.title,
                taskType: row.task_type_details?.id,
                taskTypeName: row.task_type_details?.custom_label,
                start_date: row.start_date,
                end_date: row.end_date,
                description: row.description,
                edit: true,
                taskId: row.id,
                boardId: row.board,
                isCompleted: row.is_completed,
                attachments: row.attachments,
                comments: row.comments,
                company_id: row.light_company_details?.id,
                assignee_pic: row.assignee_pic,
                internal_assignee: row.internal_assignee_light,
                external_assignee: row.external_assignee_light,
                buyer_company: row.light_company_details?.name,
                color: row.task_type_details?.color,
                owner: row.owner_details?.id,
                owner_email: row?.owner_details?.email,
                board_name: row.board_name,
                show_board: true,
                is_legal: {
                  isLegal: legalFilter == 0,
                  isLegal__completed: legalFilter == 1,
                  isLegal__upcoming: legalFilter == 2,
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

  const handleClick = (event, data) => {
    setRow(data);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClickMenuItem = (id) => {
    if (id == 1) {
      handleEditTask(row);
    } else if (id == 2) {
      window.open(
        `/board/?id=${row.boardId}&navbars=True&actions=True&card=${row.taskId}`,
        '_blank',
      );
    } else if (id == 3) {
      dispatch(show(true));
      dispatch(getSingleTask({ card_id: row?.taskId, task_info: false }));
      handleOpen({
        title: row?.taskName,
        id: row?.taskId,
        board: row?.boardId,
        internal_assignee: row?.internal_assignee?.email,
        external_assignee: row?.external_assignee?.email,
        owner: row?.owner_email,
      });
    } else if (id == 4) {
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
        legalTasks: {
          isLegal: legalFilter == 0,
          isLegal__completed: legalFilter == 1,
          isLegal__upcoming: legalFilter == 2,
        },
        last_update_type: row.isCompleted ? 'Task re-opened' : 'Task Approved',
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

  const handleEditTask = (e) => {
    handleForm(e, true);
  };

  const handleOpen = (e) => {
    openCalendar(e);
  };

  const classes = useStyles();

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <>
      <TableContainer
        className={classes.container}
        style={{ height: '100%' }}
      >
        {data?.length > 0 ? (
          <JFTable
            data={stableSort(data.length > 0 ? data : [], getComparator(order, orderBy))}
            columns={columns}
            onHeaderCellClick={handleRequestSort}
            orderedBy={orderBy}
            orderDirection={order}
            rowHeight={60}
          />
        ) : (
          <div className="text-centre">
            <strong>No Record(s) found!</strong>
          </div>
        )}
      </TableContainer>
      <Assignees
        open={showUsers}
        handleClose={handleCloseUsers}
        card={{ buyer_company: selectedData?.light_company_details }}
        recent_data={selectedData}
        assignment_type={{ internal: true }}
        history={false}
        updates={{
          allCards: legalFilter == 0,
          completed: legalFilter == 1,
          upcoming: legalFilter == 2,
        }}
      />
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
    </>
  );
}

export default React.memo(LegalTasksTable);
