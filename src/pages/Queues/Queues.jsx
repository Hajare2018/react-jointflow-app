import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import requestProject from '../../Redux/Actions/dashboard-data';
import { requestDocumentsType } from '../../Redux/Actions/documents-type';
import { setMessage, show } from '../../Redux/Actions/loader';
import QueuesTabs from '../../components/QueuesComponents/QueuesTabs';
import {
  createQueueData,
  dateFormat,
  getBoardStatus,
  getDevice,
  getDuration,
  groupBy,
} from '../../components/Utils';
import HttpClient from '../../Api/HttpClient';
import { getAllUsers } from '../../Redux/Actions/user-info';
import QueuesOverview from './QueuesOverview';
import QueuesTableActions from './QueuesTableActions';
import { useTenantContext } from '../../context/TenantContext';
import { useUserContext } from '../../context/UserContext';

function normaliseFilter(filter) {
  if (filter === null || filter === 'null') {
    return 'none';
  }

  return filter;
}

function Queues() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state?.dashboardData);
  const message = useSelector((state) => state.messageData);
  const loader = useSelector((state) => state.showLoader);
  const task_data = tasks?.data?.length > 0 ? tasks?.data : [];
  const [ganttData, setGanttData] = useState([]);
  const task_types = useSelector((state) => state?.documentsType);
  const allUsers = useSelector((state) => state.allUsersData);
  const assignee_data = allUsers?.data?.length > 0 ? allUsers?.data : [];
  const { user } = useUserContext();
  const allTypes = task_types?.data?.length > 0 ? task_types?.data : [];
  const only_actives = allTypes?.filter((type) => type.active === true);
  const active_types = only_actives?.filter(
    (type) => type.applies_to === 'Both' || type.applies_to === 'Tasks',
  );
  const [type, setType] = useState('none');
  const [assignee, setAssignee] = useState('none');
  const [department, setDepartment] = useState('none');
  const [status, setStatus] = useState('none');
  const [tableData, setTableData] = useState([]);
  let chartData = [];
  let table_data = [];
  const [ongoingTasks, setOngoingTasks] = useState(0);
  const [lateTasks, setLateTasks] = useState(0);
  const [upcomingTasks, setUpcomingTasks] = useState(0);
  // TODO FIXME setCompleted never used, this should not live in the state
  // eslint-disable-next-line no-unused-vars
  const [completed, setCompleted] = useState(false);
  const [display, setDisplay] = useState('list_view');
  const [searched, setSearched] = useState('');
  const [queueData, setQueueData] = useState(null);
  const { departments_list } = useTenantContext();

  assignee_data.sort((a, b) => {
    if (a.first_name.toLowerCase() < b.first_name.toLowerCase()) {
      return -1;
    }
    if (a.first_name.toLowerCase() > b.first_name.toLowerCase()) {
      return 1;
    }
    return 0;
  });

  const toggleDisplay = (view) => {
    setDisplay(view);
  };

  useEffect(() => {
    window.pendo.initialize({
      visitor: {
        id: user?.id,
        email: user?.email,
        full_name: user?.first_name + ' ' + user?.last_name,
        role: user?.role,
        page: 'Queues Dashboard',
      },
      account: { id: HttpClient.tenant() },
    });
    if (isMobile) {
      setDisplay('grid_view');
    }
    dispatch(show(true));
    dispatch(requestDocumentsType());
    dispatch(getAllUsers({ onlyStaff: true }));
    const cachedTaskType = normaliseFilter(localStorage.getItem('task_type'));
    const cachedAssignee = normaliseFilter(localStorage.getItem('assignee'));
    const cachedDepartment = normaliseFilter(localStorage.getItem('department'));
    const cachedStatus = normaliseFilter(localStorage.getItem('status'));
    setType(cachedTaskType);
    setAssignee(cachedAssignee);
    setDepartment(cachedDepartment);
    setStatus(cachedStatus);
    if (
      cachedTaskType === 'none' &&
      cachedAssignee === 'none' &&
      cachedDepartment === 'none' &&
      cachedStatus === 'none'
    ) {
      dispatch(setMessage('Please select a Filter above.'));
    } else if (
      cachedTaskType !== null ||
      cachedAssignee !== null ||
      cachedDepartment !== null ||
      cachedStatus !== null
    ) {
      dispatch(
        requestProject({
          forQueues: true,
          task_type: cachedTaskType == null ? 'none' : cachedTaskType,
          assignee: cachedAssignee == null ? 'none' : cachedAssignee,
          department: cachedDepartment == null ? 'none' : cachedDepartment,
          status: cachedStatus == null ? 'none' : cachedStatus,
          is_completed: completed,
        }),
      );
    } else {
      dispatch(setMessage('Please select a Filter above.'));
    }
  }, []);

  task_data.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
  task_data?.forEach((element) => {
    chartData.push({
      task_id: element?.id,
      task_name: element?.title,
      color: element?.task_type_details?.color,
      start_date: element?.start_date,
      end_date: element?.end_date,
      actual_completion_date: element?.actual_completion_date,
      task_timing: element?.task_timing,
      is_completed: element?.is_completed,
      company: element?.light_company_details,
      project_value: element?.project_value,
      last_doc: element?.last_uploaded_document?.name,
    });
    table_data.push({
      task_name: element?.title,
      task_type_name:
        element?.task_type_details !== null ? element.task_type_details?.custom_label : 'N/A',
      task_type: element?.task_type_details?.id,
      start_date: element?.start_date,
      end_date: element?.end_date,
      attachment_count: element?.nb_attachments,
      project_value: element?.project_value,
      task_status: element?.is_completed,
      task_id: element?.id,
      board_id: element?.board,
      board_name: element?.board_name,
      document_type: element?.task_type_details,
      description: element?.description,
      edit: true,
      attachments: element?.last_uploaded_document,
      owner: element.owner_details?.first_name,
      owner_details: element?.owner_details,
      comments: element?.comments,
      company: element?.light_company_details,
      internal_assignee: element?.internal_assignee_light,
      external_assignee: element?.external_assignee_light,
      internal_assignee_name: element.internal_assignee_name,
      external_assignee_name: element.external_assignee_name,
      taskColor: element?.color,
      is_template: element?.is_board_template,
      board_priority: element?.board_priority,
      steps: element?.steps_count,
      todo_steps: element?.todo_steps_count,
      done_steps: element?.done_steps_count,
    });
  });
  let late_tasks = task_data?.filter(
    (item) => new Date().toJSON().slice(0, 10).replace(/-/g, '-') > item.end_date,
  ).length;
  let upcoming_tasks = task_data?.filter(
    (item) => item.start_date > new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
  ).length;
  let ongoing_tasks = task_data?.filter(
    (item) =>
      item.start_date <= new Date().toJSON().slice(0, 10).replace(/-/g, '-') &&
      new Date().toJSON().slice(0, 10).replace(/-/g, '-') <= item.end_date,
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

  useLayoutEffect(() => {
    // if (type !== "Task Type") {
    if (chartData?.length > 0 && table_data?.length > 0) {
      setGanttData(chartData);
      setTableData(table_data);
    }
    setLateTasks(completed ? completedLate : late_tasks);
    setUpcomingTasks(completed ? completedOnTime : upcoming_tasks);
    setOngoingTasks(completed ? completedEarly : ongoing_tasks);
  }, [tasks]);

  const handleType = (event) => {
    setType(event.target.value);
    if (
      assignee === 'none' &&
      event.target.value === 'none' &&
      department === 'none' &&
      status === 'none'
    ) {
      dispatch(setMessage('Please select a Filter above.'));
      return;
    } else {
      dispatch(show(true));
      dispatch(
        requestProject({
          forQueues: true,
          task_type: event.target.value,
          assignee: assignee,
          department: department,
          status: status,
          is_completed: completed,
        }),
      );
      dispatch(setMessage(''));
    }
  };

  const handleAssignee = (event) => {
    setAssignee(event.target.value);
    if (
      type === 'none' &&
      event.target.value === 'none' &&
      department === 'none' &&
      status === 'none'
    ) {
      dispatch(setMessage('Please select a Filter above.'));
      return;
    } else {
      dispatch(show(true));
      dispatch(setMessage(''));
      dispatch(
        requestProject({
          forQueues: true,
          task_type: type,
          assignee: event.target.value,
          status: status,
          department: department,
          is_completed: completed,
        }),
      );
    }
  };
  const handleDepartment = (event) => {
    setDepartment(event.target.value);
    if (
      type === 'none' &&
      event.target.value === 'none' &&
      assignee === 'none' &&
      status === 'none'
    ) {
      dispatch(setMessage('Please select a Filter above.'));
    } else {
      dispatch(show(true));
      dispatch(setMessage(''));

      dispatch(
        requestProject({
          forQueues: true,
          task_type: type,
          assignee: assignee,
          status: status,
          department: event.target.value,
          is_completed: completed,
        }),
      );
    }
  };

  const handleStatus = (event) => {
    setStatus(event.target.value);
    if (
      type === 'none' &&
      event.target.value === 'none' &&
      assignee === 'none' &&
      department === 'none'
    ) {
      dispatch(setMessage('Please select a Filter above.'));
    } else {
      dispatch(show(true));
      dispatch(setMessage(''));

      dispatch(
        requestProject({
          forQueues: true,
          task_type: type,
          assignee: assignee,
          status: event.target.value,
          department: department,
          is_completed: completed,
        }),
      );
    }
  };
  const isMobile = getDevice();

  const requestSearch = (searchedVal) => {
    const filteredRows = (
      display === 'list_view' || display === 'grid_view' ? tableData : chartData
    ).filter((row) => {
      return row.task_name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setQueueData(filteredRows);
  };

  const cancelSearch = () => {
    setSearched('');
    requestSearch(searched);
  };

  const handleSaveFilters = () => {
    localStorage.setItem('task_type', normaliseFilter(type));
    localStorage.setItem('assignee', normaliseFilter(assignee));
    localStorage.setItem('department', normaliseFilter(department));
    localStorage.setItem('status', normaliseFilter(status));
  };

  const groupedTaskTypes = groupBy(active_types, 'department');
  const sortedData = Object.fromEntries(
    Object.keys(groupedTaskTypes)
      .sort()
      .map((key) => [key, groupedTaskTypes[key]]),
  );

  const newArray = task_data.map((task) =>
    createQueueData(
      task?.board_name,
      task?.title,
      task?.task_type_details?.custom_label,
      dateFormat(new Date(task?.start_date), true),
      dateFormat(new Date(task?.end_date), true),
      task?.actual_completion_date == null
        ? 'NA'
        : dateFormat(new Date(task?.actual_completion_date), true),
      task?.light_company_details?.name,
      task?.internal_assignee_light == null
        ? 'NA'
        : task?.internal_assignee_light?.first_name +
            ' ' +
            task?.internal_assignee_light?.last_name,
      task?.external_assignee_light == null
        ? 'NA'
        : task?.external_assignee_light?.first_name +
            ' ' +
            task?.external_assignee_light?.last_name,
      task?.duration,
      getDuration(
        task?.is_completed ? new Date(task?.actual_completion_date) : new Date(),
        new Date(task?.end_date),
      ),
      task?.side,
      getBoardStatus(task?.is_completed, task?.start_date).text,
    ),
  );

  const csvHeader = [
    [
      'Project Name',
      'Task Name',
      'Task Type',
      'Start Date',
      'Planned End Date',
      'Actual Completion Day',
      'Account Name',
      'Internal Assignee',
      'External Assignee',
      'Duration (In Days)',
      'Lapse Days Since Start',
      'Task Side',
      'Status',
    ],
  ];
  const newData = csvHeader.concat(newArray);

  return (
    <main
      id="page"
      className="panel-view"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
      }}
    >
      <div
        className="overview"
        style={{
          position: 'sticky',
          top: 60,
          zIndex: 4,
        }}
      >
        <QueuesOverview
          completed={completed}
          lateTasks={lateTasks}
          ongoingTasks={ongoingTasks}
          upcomingTasks={upcomingTasks}
        />
        <QueuesTableActions
          searched={searched}
          requestSearch={requestSearch}
          cancelSearch={cancelSearch}
          display={display}
          toggleDisplay={toggleDisplay}
          handleStatusSelection={handleStatus}
          handleTaskTypeSelection={handleType}
          handleDepartmentSelection={handleDepartment}
          handleAssigneeSelection={handleAssignee}
          selectedStatus={status}
          selectedTaskType={type}
          selectedDepartment={department}
          selectedAssignee={assignee}
          taskTypes={Object.entries(sortedData)}
          exportData={newData}
          handleSaveFilters={handleSaveFilters}
          assignees={assignee_data}
          departments={departments_list}
        />
      </div>
      {loader?.show ? (
        <div className="text-centre mt-5">
          <strong>Loading...</strong>
        </div>
      ) : task_data?.length > 0 ? (
        <QueuesTabs
          gantt={queueData?.length > 0 ? queueData : ganttData || []}
          table={queueData?.length > 0 ? queueData : tableData || []}
          view={display}
          task_type={type}
          completed={completed}
        />
      ) : (
        <div className="d-flex justify-centre mt-5">
          {(type === 'Task Type' &&
            assignee === 'Assignee' &&
            department === 'Department' &&
            status === 'Status') ||
          (type === 'none' && assignee === 'none' && department === 'none' && status === 'none') ? (
            <strong>Please select a Filter above.</strong>
          ) : (
            <strong>{message.message}</strong>
          )}
        </div>
      )}
    </main>
  );
}

export default React.memo(Queues);
