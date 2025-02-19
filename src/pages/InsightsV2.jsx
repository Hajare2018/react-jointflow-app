import {
  Avatar,
  FormControlLabel,
  Grid,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
} from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createImageFromInitials, currencyFormatter } from '../components/Utils';
import requestProject from '../Redux/Actions/dashboard-data';
import { requestDocumentsType } from '../Redux/Actions/documents-type';
import { show } from '../Redux/Actions/loader';
import newTab from '../assets/icons/OpenNewTabIconBlue.png';
import ProjectForm from '../components/ProjectForm/ProjectForm';
import ongoingIcon from '../assets/icons/progress.png';
import upcomingIcon from '../assets/icons/Calendar32.png';
import bellIcon from '../assets/icons/Bell_Orange32.gif';
import DashboardApexChart from '../components/ChartComponent/DashboardApexChart';
import { requestTaskSteps } from '../Redux/Actions/task-info';
import { getComments } from '../Redux/Actions/comments';
import { getAllUsers } from '../Redux/Actions/user-info';
import { getSingleCardDocs } from '../Redux/Actions/document-upload';
import getSingleTask from '../Redux/Actions/single-task';
import { useTenantContext } from '../context/TenantContext';

const StyledTableCell = withStyles(() => ({
  head: {
    backgroundColor: '#eef2f6',
    color: '#000000',
    fontWeight: '700',
  },
  body: {
    fontSize: 16,
    height: 50,
    padding: '8px !important',
    whiteSpace: 'nowrap',
  },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
  root: {
    '&:nth-of-type(even)': {
      backgroundColor: '#f5f5f5',
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: '100%',
  },
  container: {
    maxHeight: `65vh`,
    '@media(max-height: 1080px)': {
      maxHeight: `58vh`,
    },
    '@media(max-height: 1024px)': {
      maxHeight: `48vh`,
    },
    '@media(max-height: 900px)': {
      maxHeight: `45vh`,
    },
    '@media(max-height: 768px)': {
      maxHeight: `37vh`,
    },
  },
});

function InsightsV2() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const tasks = useSelector((state) => state?.dashboardData);
  const { tenant_locale, currency_symbol } = useTenantContext();
  const task_data = (tasks?.data?.length > 0 && tasks?.data) || [];
  const [data, setData] = useState([]);
  const task_types = useSelector((state) => state?.documentsType);
  const allTypes = (task_types?.data?.length > 0 && task_types?.data) || [];
  const only_actives = allTypes?.filter((type) => type.active === true);
  const active_types = only_actives?.filter(
    (type) => type.applies_to === 'Both' || type.applies_to === 'Tasks',
  );
  const [type, setType] = useState('Task Type');
  const [tableData, setTableData] = useState([]);
  let chartData = [];
  const [formData, setFormData] = useState([]);
  const [open, setOpen] = useState(false);
  const [ongoingTasks, setOngoingTasks] = useState(0);
  const [lateTasks, setLateTasks] = useState(0);
  const [upcomingTasks, setUpcomingTasks] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleSwitch = () => {
    setCompleted(!completed);
    if (!completed) {
      dispatch(show(true));
      dispatch(requestProject({ task_type__completed: type }));
    } else {
      dispatch(show(true));
      dispatch(requestProject({ task_type: type }));
    }
  };

  const handleEditTask = (e) => {
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
    setFormData(e);
    setOpen(true);
  };

  const handleCloseEdit = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(show(true));
    dispatch(requestDocumentsType());
  }, []);

  useEffect(() => {
    if (type !== 'Task Type') {
      task_data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
      setTableData(task_data);
      task_data?.forEach((element) => {
        chartData.push({
          task_id: element?.id,
          task_name: element?.title,
          color: element?.task_type_details?.color,
          start_date: element?.start_date,
          end_date: element?.end_date,
          is_completed: element?.is_completed,
          company: element?.buyer_company_details,
          project_value: element?.project_value,
          last_doc: (element?.attachments?.length > 0 && element?.attachments?.[0]?.name) || 'NA',
        });
      });
      chartData.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
      setData(chartData);
      let late_tasks = task_data?.filter((item) => new Date(item.end_date) < new Date()).length;
      let upcoming_tasks = task_data?.filter(
        (item) => new Date(item.start_date) > new Date(),
      ).length;
      let ongoing_tasks = task_data?.filter(
        (item) => new Date(item.start_date) <= new Date() && new Date(item.end_date) >= new Date(),
      ).length;
      let completedLate = task_data?.filter(
        (item) => item.actual_completion_date > item.end_date,
      ).length;
      let completedOnTime = task_data?.filter(
        (item) => item.actual_completion_date === item.end_date,
      ).length;
      let completedEarly = task_data?.filter(
        (item) => item.actual_completion_date < item.end_date,
      ).length;
      setLateTasks((completed && completedLate) || late_tasks);
      setUpcomingTasks((completed && completedOnTime) || upcoming_tasks);
      setOngoingTasks((completed && completedEarly) || ongoing_tasks);
    } else {
      setData([]);
    }
  }, [tasks]);

  const handleType = (event) => {
    dispatch(show(true));
    if (event.target.value !== 'Task Type') {
      if (completed) {
        dispatch(requestProject({ task_type__completed: event.target.value }));
        setType(event.target.value);
      } else {
        dispatch(requestProject({ task_type: event.target.value }));
        setType(event.target.value);
      }
      task_data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
      setTableData(task_data);
      task_data?.forEach((element) => {
        chartData.push({
          task_id: element?.id,
          task_name: element?.title,
          color: element?.task_type_details?.color,
          start_date: element?.start_date,
          end_date: element?.end_date,
          is_completed: element?.is_completed,
          company: element?.buyer_company_details,
          project_value: element?.project_value,
          last_doc: (element?.attachments?.length > 0 && element?.attachments?.[0]?.name) || 'NA',
        });
      });
      setData(chartData);
    } else {
      return;
    }
  };

  return (
    <main
      id="page"
      className="panel-view"
    >
      <div
        className="overview insightPage"
        style={{
          position: 'sticky',
          top: 20,
          backgroundColor: '#f9fbfd',
          zIndex: 4,
        }}
      >
        <h1 className="overview__heading_project">Tasks Insights</h1>
        <div className="project-header">
          {data.length > 0 && (
            <FormControlLabel
              style={{ float: 'right' }}
              control={
                <Switch
                  checked={completed}
                  onChange={handleSwitch}
                  name="completed"
                />
              }
              label={<span>{(completed && 'Hide') || 'Show'} Completed Tasks</span>}
            />
          )}
          <div
            className="selectbox selectbox-m"
            style={{
              display: 'flex',
              marginTop: '20px',
            }}
          >
            <label
              className="form-label"
              style={{ width: 120, color: '#222' }}
            >
              Filter by:
            </label>
            <select
              className="form-select"
              style={{ color: '#000000' }}
              value={type}
              onChange={handleType}
            >
              <option
                value="Task Type"
                disabled
                aria-disabled
              >
                Task Type
              </option>
              {active_types?.map((item) => (
                <option
                  key={item.custom_label}
                  value={item.custom_label}
                >
                  {item.custom_label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="analytics-card-container">
          <div className="analytics-card analytics-card__three">
            <div className="analytics-card__content">
              <p>{(completed && 'Completed Late') || 'Late Tasks'}</p>
              <h1>{lateTasks}</h1>
            </div>
            <div className="analytics-card__icon">
              <img
                src={bellIcon}
                style={{ color: '#fc8c8a', height: 30, width: 30 }}
              />
            </div>
          </div>
          <div className="analytics-card analytics-card__one">
            <div className="analytics-card__content">
              <p>{(completed && 'Completed on time') || 'Ongoing Tasks'}</p>
              <h1>{ongoingTasks}</h1>
            </div>
            <div className="analytics-card__icon">
              <img
                src={ongoingIcon}
                style={{ color: '#3edab7', height: 30, width: 30 }}
              />
            </div>
          </div>
          <div className="analytics-card analytics-card__two">
            <div className="analytics-card__content">
              <p>{(completed && 'Completed Early') || 'Upcoming Tasks'}</p>
              <h1>{upcomingTasks}</h1>
            </div>
            <div className="analytics-card__icon">
              <img
                src={upcomingIcon}
                style={{ color: '#83bdff', height: 30, width: 30 }}
              />
            </div>
          </div>
        </div>
      </div>
      {(data.length > 0 && (
        <Grid
          container
          direction="row"
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={3}
          >
            <div id="tasks">
              <TableContainer style={{ marginTop: 25 }}>
                <Table
                  className={classes.table}
                  aria-label="customized table"
                >
                  <TableBody>
                    {(tableData || []).map((task) => (
                      <StyledTableRow key={task.task_id}>
                        <StyledTableCell align="left">
                          <div className="d-flex">
                            <Avatar
                              src={
                                (task?.buyer_company_details?.company_image &&
                                  task?.buyer_company_details?.company_image) ||
                                createImageFromInitials(
                                  200,
                                  task?.buyer_company_details?.name,
                                  '#627daf',
                                )
                              }
                            />
                            <div className="d-flex-column ml-10">
                              <h3
                                style={{
                                  fontSize: 14,
                                  fontWeight: '700',
                                  color: '#627daf',
                                  cursor: 'pointer',
                                }}
                                onClick={() =>
                                  handleEditTask({
                                    taskName: task?.title,
                                    edit: true,
                                    taskId: task?.id,
                                    boardId: task?.board,
                                    board_name: task?.board_name,
                                    byType: true,
                                    show_board: true,
                                  })
                                }
                              >
                                {task?.title?.length > 18
                                  ? (task?.title).substring(0, 18 - 3) + '...'
                                  : task?.title}
                              </h3>
                              <div className="d-flex-row">
                                <h2>
                                  {currencyFormatter(
                                    tenant_locale,
                                    (task?.project_value === null && '0') || task?.project_value,
                                    (currency_symbol === null && 'GBP') || currency_symbol,
                                  )}
                                </h2>
                                <Link
                                  to={`/board/?id=${task.board}&navbars=True&actions=True&card=${task.id}`}
                                  target="_blank"
                                >
                                  <Tooltip
                                    title={`Open Project "${task?.board_name}" in new tab`}
                                    arrow
                                    placement="top"
                                  >
                                    <img
                                      src={newTab}
                                      style={{
                                        height: 15,
                                        width: 15,
                                        marginLeft: 10,
                                      }}
                                    />
                                  </Tooltip>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Grid>
          <Grid
            className="overflowBox"
            item
            xs={12}
            sm={12}
            md={12}
            lg={9}
          >
            <div style={{ height: '100%' }}>
              <DashboardApexChart
                dashboardTasks={data || []}
                height={'100%'}
                forQueues
              />
            </div>
          </Grid>
        </Grid>
      )) || (
        <div
          className="d-flex justify-centre"
          style={{ marginTop: 120 }}
        >
          {(type === 'Task Type' && <strong>Please select a Task Type above</strong>) || (
            <strong>No Data available for {type}, Please select another one!</strong>
          )}
        </div>
      )}
      <ProjectForm
        handleClose={handleCloseEdit}
        formData={formData}
        open={open}
        fromComponent="InsightsV2"
        key={formData ? formData?.taskId : 'InsightsV2'}
      />
    </main>
  );
}

export default React.memo(InsightsV2);
