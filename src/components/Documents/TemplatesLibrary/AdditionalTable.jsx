import React, { useEffect, useState } from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useDispatch, useSelector } from 'react-redux';
import { Edit } from '@mui/icons-material';
import { keepData, show } from '../../../Redux/Actions/loader';
import ArchiveIcon from '../../../assets/icons/archive.png';
import ArchiveDanger from '../../../assets/icons/archive_danger.png';
import ConfirmDialog from '../../ProjectForm/Components/ConfirmDialog';
import editTaskData from '../../../Redux/Actions/update-task-info';
import { requestDocumentsType } from '../../../Redux/Actions/documents-type';
import { getAllUsers } from '../../../Redux/Actions/user-info';
import getSingleTask from '../../../Redux/Actions/single-task';
import TaskPreview from './TaskPreview';
import { getPlurals } from '../../Utils';
import EditForm from './EditForm';
import TaskForm from './TemplatesTask/TaskForm';
import { handleTabsChange } from '../../../Redux/Actions/tab-values';
import { ReactInlineEdit } from '../../ReactEditableComponents';
import { requestTaskSteps } from '../../../Redux/Actions/task-info';
import { useTenantContext } from '../../../context/TenantContext';
import { Switch } from '../../../component-lib/catalyst/switch';
import HttpClient from '../../../Api/HttpClient';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  root: {
    padding: 4,
    color: '#222222',
  },
  body: {
    fontSize: 16,
    height: 20,
  },
  appBar: {
    position: 'relative',
    backgroundColor: '#627daf',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  dialogPaper: {
    position: 'absolute',
    right: 0,
    height: '100%',
  },
}));

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
    borderBottom: `0px !important`,
    padding: `8px !important`,
  },
  body: {
    fontSize: 16,
    height: 20,
    padding: 8,
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

function AdditionalTable({ jiraIntegrationStatus, setJiraIntegrationStatus }) {
  const { jira_integration_enabled: jiraIntegrationEnabled } = useTenantContext();
  const classes = useStyles();
  const [openForm, setOpenForm] = useState(false);
  const [archiveTask, setArchiveTask] = useState(false);
  const [taskPreview, setTaskPreview] = useState(false);
  const [editData, setEditData] = useState([]);
  const { activate_steplist } = useTenantContext();
  const dispatch = useDispatch();
  const handleOpenForm = (e) => {
    dispatch(show(true));
    dispatch(requestDocumentsType());
    dispatch(getAllUsers({ onlyStaff: true }));
    setOpenForm(true);
    if (e.add) {
      setEditData([]);
      dispatch(keepData(false));
    } else if (e.edit) {
      setEditData(e);
      dispatch(handleTabsChange(0));
      dispatch(getSingleTask({ card_id: e.task_id, task_info: false }));
      dispatch(requestTaskSteps({ id: e.task_id, fetchByTaskType: false }));
      dispatch(keepData(true));
    }
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const openArchiveDialog = (e) => {
    setEditData(e);
    setArchiveTask(!archiveTask);
  };

  const closeArchiveDialog = (e) => {
    if (e.close) {
      handleArchiveTask();
    }
    setArchiveTask(!archiveTask);
  };

  const handleArchiveTask = () => {
    dispatch(
      editTaskData({
        id: editData?.id,
        title: editData?.title,
        start_date: editData?.start_date,
        description: editData?.description,
        end_date: editData?.end_date,
        board: projectData?.data?.[0]?.id,
        owner: editData?.owner_details?.id,
        color: editData?.color,
        is_completed: editData?.is_completed,
        document_type: editData?.type,
        archived: 'True',
        forTemplates: true,
      }),
    );
  };

  const projectData = useSelector((state) => state?.singleProjectData);
  useEffect(() => {}, [projectData]);

  let taskData = [];
  taskData.push(projectData?.data?.[0]?.cards);

  let sortedTasks = [];
  let unArchivedTasks = [];
  let max = [];
  sortedTasks.push(taskData?.[0]?.sort((a, b) => a.start_date - b.start_date));
  sortedTasks?.[0]?.forEach((element) => {
    element.total_duration = element.offset + element.duration;
    max.push(element.total_duration);
  });
  unArchivedTasks.push(sortedTasks?.[0]?.filter((item) => item.archived === false));

  const showPreview = () => {
    setTaskPreview(!taskPreview);
  };

  const handleUpdateTaskTitle = (value, id) => {
    dispatch(
      editTaskData({
        id: id,
        title: value,
        board: projectData?.data?.[0]?.id,
        forTemplates: true,
      }),
    );
  };

  return (
    <>
      <div
        style={{
          position: 'sticky',
          top: '11%',
          backgroundColor: '#ffff',
          padding: 10,
          zIndex: 999,
        }}
      >
        <EditForm forTable />
      </div>
      <TableContainer
        style={{
          backgroundColor: '#ffff',
          padding: 10,
        }}
        component="div"
      >
        {unArchivedTasks[0]?.length > 0 ? (
          <Table
            className={classes.table}
            stickyHeader
          >
            <TableHead>
              <StyledTableRow className={classes.root}>
                <StyledTableCell />
                <StyledTableCell className="width-33">Name</StyledTableCell>
                <StyledTableCell>Type</StyledTableCell>
                <StyledTableCell>Preassigned</StyledTableCell>
                <StyledTableCell>Nb Docs</StyledTableCell>
                {activate_steplist && <StyledTableCell>Nb Steps</StyledTableCell>}
                <StyledTableCell>Timing</StyledTableCell>
                <StyledTableCell>Duration</StyledTableCell>
                <StyledTableCell>Weight</StyledTableCell>
                {jiraIntegrationEnabled && <StyledTableCell>Sync</StyledTableCell>}
                <StyledTableCell>Actions</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody className={classes.body}>
              {unArchivedTasks[0]?.map((row, index) => (
                <StyledTableRow key={row?.id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>
                    <ReactInlineEdit
                      value={row?.title}
                      setValue={(value) => handleUpdateTaskTitle(value, row?.id)}
                      checked={false}
                      charLength="50"
                      useTextArea
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    {row?.task_type_details?.custom_label}
                    {!row?.task_type_details?.active && '(archived)'}
                  </StyledTableCell>
                  <StyledTableCell>
                    {row?.internal_assignee_details == null && !row?.template_owner_assigned
                      ? 'Not assigned'
                      : row?.internal_assignee_details == null && row?.template_owner_assigned
                        ? '<Owner assigned>'
                        : row?.internal_assignee_details?.first_name +
                          ' ' +
                          row?.internal_assignee_details?.last_name}
                  </StyledTableCell>
                  <StyledTableCell>{row?.document_count}</StyledTableCell>
                  {activate_steplist && <StyledTableCell>{row?.steps_count}</StyledTableCell>}
                  <StyledTableCell>
                    <Tooltip
                      title={
                        row.task_timing === 'Offset'
                          ? getPlurals(row.offset, 'Day')
                          : row.ref_task_name
                      }
                      placement="top"
                    >
                      <p>
                        {row.task_timing === 'Sequential'
                          ? 'After'
                          : row.task_timing === 'Synchronous'
                            ? 'Same Time'
                            : row.task_timing}
                      </p>
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell>{getPlurals(row?.duration, 'Day')}</StyledTableCell>
                  <StyledTableCell>
                    {`${row?.weight} (${Math.round(row?.weight_percentage * 100)}%)`}
                  </StyledTableCell>
                  {jiraIntegrationEnabled && (
                    <StyledTableCell>
                      <Switch
                        name="allow_jira_sync"
                        disabled={jiraIntegrationStatus.jiraSyncEnabled === false}
                        checked={jiraIntegrationStatus.cards[row?.id]?.jiraSyncEnabled}
                        onChange={(jiraSyncEnabled) => {
                          HttpClient.updateTaskJiraIntegrationStatus({
                            boardId: projectData?.data?.[0]?.id,
                            taskId: row?.id,
                            jiraSyncEnabled,
                          });
                          setJiraIntegrationStatus((prev) => ({
                            ...prev,
                            cards: { ...prev.cards, [row?.id]: { jiraSyncEnabled } },
                          }));
                        }}
                      />
                    </StyledTableCell>
                  )}
                  <StyledTableCell>
                    <IconButton
                      onClick={() => {
                        handleOpenForm({
                          edit: true,
                          taskName: row?.title,
                          type: row?.task_type_details?.id,
                          startDate: row?.start_date,
                          endDate: row?.end_date,
                          task_id: row?.id,
                          description: row?.description,
                          is_completed: row?.is_completed,
                          offset: row?.offset,
                          duration: row?.duration,
                          color: row?.color,
                          internal_assignee: row?.internal_assignee_details,
                          external_assignee: row?.external_assignee_details,
                          documents: row?.attachments,
                        });
                      }}
                    >
                      <Edit style={{ color: '#627daf' }} />
                    </IconButton>
                    <IconButton onClick={() => openArchiveDialog(row)}>
                      <img
                        src={ArchiveIcon}
                        onMouseOver={(e) => (e.currentTarget.src = ArchiveDanger)}
                        onMouseOut={(e) => (e.currentTarget.src = ArchiveIcon)}
                        style={{ width: 20, height: 20 }}
                      />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-centre p-15">
            <strong style={{ color: '#6385b7' }}>Add your first Task/Flow to this Playbook!</strong>
          </div>
        )}
      </TableContainer>
      <div className="d-flex justify-space-around p-15">
        {taskData?.[0]?.length > 0 && (
          <Button
            variant="contained"
            onClick={showPreview}
            style={{
              backgroundColor: '#6385b7',
              color: '#ffffff',
              fontSize: 16,
            }}
          >
            View Project Gantt Chart
          </Button>
        )}
        <Button
          variant="contained"
          onClick={() => handleOpenForm({ add: true })}
          style={{
            backgroundColor: '#6385b7',
            color: '#ffffff',
            fontSize: 16,
          }}
        >
          + Add Task
        </Button>
      </div>
      <TaskForm
        open={openForm}
        handleClose={handleCloseForm}
        forAdd={editData}
      />
      {archiveTask && (
        <ConfirmDialog
          open={archiveTask}
          handleClose={closeArchiveDialog}
          dialogTitle={`Archive task`}
          dialogContent={'Are you sure to archive this task?'}
        />
      )}
      <TaskPreview
        open={taskPreview}
        handleClose={showPreview}
      />
    </>
  );
}

export default React.memo(AdditionalTable);
