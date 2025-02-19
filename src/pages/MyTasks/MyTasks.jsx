import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import MyTasksTable from '../../components/MyTasksTable';
import ProjectForm from '../../components/ProjectForm/ProjectForm';
import getSingleTask, { getFilteredTasks } from '../../Redux/Actions/single-task';
import { getDevice, groupBy } from '../../components/Utils';
import QueuesTaskCard from '../../components/QueuesComponents/QueuesTaskCard';
import HttpClient from '../../Api/HttpClient';
import { requestDocumentsType } from '../../Redux/Actions/documents-type';
import MyTasksOverview from './MyTasksOverview';
import MyTasksTableActions from './MyTasksTableActions';
import { getComments } from '../../Redux/Actions/comments';
import { getAllUsers } from '../../Redux/Actions/user-info';
import { requestTaskSteps } from '../../Redux/Actions/task-info';
import { getSingleCardDocs } from '../../Redux/Actions/document-upload';
import { useTenantContext } from '../../context/TenantContext';
import { useUserContext } from '../../context/UserContext';

function MyTasks({ onHome }) {
  const dispatch = useDispatch();
  const [display, setDisplay] = useState('list_view');
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState([]);
  const [searched, setSearched] = useState('');
  const [allRows, setAllRows] = useState([]);
  const [totalValue, setTotalValue] = useState('');
  const [myTaskData, setMyTaskData] = useState(null);
  const [type, setType] = useState('none');
  const [status, setStatus] = useState('');

  const tasks = useSelector((state) => state.filteredCardsData);
  const showLoader = useSelector((state) => state.showLoader);
  const task_types = useSelector((state) => state?.documentsType);

  const { user } = useUserContext();

  const { tenant_locale, currency_symbol, activate_steplist } = useTenantContext();

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
        page: 'My Tasks Dashboard',
      },
      account: { id: HttpClient.tenant() },
    });
    dispatch(requestDocumentsType());
    refresh();
  }, []);

  const refresh = () => {
    dispatch(
      getFilteredTasks({
        user_id: user?.id,
        filterList: true,
        type: type,
        status: status,
      }),
    );
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleEditForm = (edit, show) => {
    if ('taskId' in (edit || {})) {
      dispatch(getAllUsers({ onlyStaff: true }));
      dispatch(getComments({ id: edit?.taskId }));
      dispatch(getSingleCardDocs({ doc_id: edit?.taskId, archived: false }));
      if (activate_steplist) {
        dispatch(
          requestTaskSteps({
            id: edit?.taskId,
            fetchByTaskType: false,
          }),
        );
      }
      dispatch(
        getSingleTask({
          card_id: edit?.taskId,
          board_id: edit?.boardId,
          task_info: true,
        }),
      );
      setFormData(edit);
      setOpen(show);
    } else {
      return;
    }
  };

  const allTasks = tasks?.data?.length > 0 ? tasks?.data : [];

  useEffect(() => {
    let projectValues = [];
    let allData = [];
    allTasks.forEach((element) =>
      allData.push({
        task_name: element.title,
        task_type_name: element.task_type_details ? element.task_type_details.custom_label : 'N/A',
        task_type: element.task_type_details && element.task_type_details.id,
        start_date: element.start_date,
        end_date: element.end_date,
        attachment_count: element.attachments.length,
        project_value: element?.project_value,
        task_status: element.is_completed,
        task_id: element.id,
        board_id: element.board,
        board_name: element.board_name,
        document_type: element?.task_type_details,
        description: element?.description,
        edit: true,
        attachments: element.attachments,
        owner: element?.owner_details?.first_name,
        owner_details: element?.owner_details,
        comments: element.comments,
        company: element?.buyer_company_details,
        internal_assignee: element?.internal_assignee_details,
        external_assignee: element?.external_assignee_details,
        taskColor: element?.color,
        is_template: element?.is_board_template,
        board_priority: element?.board_priority,
        taskTypeName: element?.task_type_details?.custom_label,
        steps: element?.steps_count,
        todo_steps: element?.todo_steps_count,
        done_steps: element?.done_steps_count,
      }),
    );
    let slicedData = allData?.slice(0, 5);
    if (allData?.length > 0) {
      setAllRows(onHome ? slicedData : allData);
    }
    allTasks.forEach((element) => {
      projectValues.push(element.project_value);
    });
    setTotalValue(projectValues.reduce((a, b) => a + b, 0));
  }, [tasks, totalValue]);

  const allTypes = task_types?.data?.length > 0 ? task_types?.data : [];
  const only_actives = allTypes?.filter((type) => type.active === true);
  const myTasks = tasks?.data?.length > 0 ? tasks?.data : [];
  const completedTasks = myTasks.filter((item) => item.is_completed === true);
  const inCompleteTasks = myTasks.filter((item) => item.is_completed === false);
  const inFutureTasks = myTasks.filter(
    (item) => item.start_date > new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
  );
  const completed = [];
  const inComplete = [];
  const futureTasks = [];
  const completedTasksValue = [];
  const inCompleteTasksValue = [];
  const projectValues = [];
  myTasks.forEach((element) => {
    projectValues.push(element.project_value);
  });
  myTasks.forEach((element) => {
    completed.push({
      task_name: element.title,
      task_type_name: element.task_type_details ? element.task_type_details.custom_label : 'N/A',
      task_type: element.task_type_details && element.task_type_details.id,
      start_date: element.start_date,
      end_date: element.end_date,
      attachment_count: element.attachments.length,
      project_value: element?.project_value,
      task_status: element.is_completed,
      task_id: element.id,
      board_id: element.board,
      board_name: element.board_name,
      document_type: element?.task_type_details,
      description: element?.description,
      edit: true,
      attachments: element.attachments,
      owner: element.owner_details,
      owner_details: element?.owner_details,
      comments: element.comments,
      company: element?.buyer_company_details,
      internal_assignee: element?.internal_assignee_details,
      external_assignee: element?.external_assignee_details,
      taskColor: element?.color,
      is_template: element?.is_board_template,
      board_priority: element?.board_priority,
      steps: element?.steps_count,
      todo_steps: element?.todo_steps_count,
      done_steps: element?.done_steps_count,
    });
  });
  completedTasks.forEach((element) => {
    completedTasksValue.push(element.project_value);
  });

  inCompleteTasks.forEach((element) => {
    inComplete.push({
      task_name: element.title,
      task_type_name: element.task_type_details ? element.task_type_details.custom_label : 'N/A',
      task_type: element.task_type_details && element.task_type_details.id,
      start_date: element.start_date,
      end_date: element.end_date,
      attachment_count: element.attachments.length,
      project_value: element?.project_value,
      task_status: element.is_completed,
      task_id: element.id,
      description: element?.description,
      board_id: element.board,
      board_name: element.board_name,
      document_type: element?.task_type_details,
      edit: true,
      attachments: element.attachments,
      owner: element.owner_details,
      owner_details: element?.owner_details,
      comments: element.comments,
      company: element?.buyer_company_details,
      internal_assignee: element?.internal_assignee_details,
      external_assignee: element?.external_assignee_details,
      taskColor: element?.color,
      board_priority: element?.board_priority,
      steps: element?.steps_count,
      todo_steps: element?.todo_steps_count,
      done_steps: element?.done_steps_count,
    });
  });
  inCompleteTasks.forEach((element) => {
    inCompleteTasksValue.push(element.project_value);
  });

  inFutureTasks.forEach((element) => {
    futureTasks.push({
      task_name: element.title,
      task_type_name: element.task_type_details ? element.task_type_details.custom_label : 'N/A',
      task_type: element.task_type_details && element.task_type_details.id,
      start_date: element.start_date,
      end_date: element.end_date,
      attachment_count: element.attachments.length,
      project_value: element?.project_value,
      task_status: element.is_completed,
      task_id: element.id,
      description: element?.description,
      board_id: element.board,
      board_name: element.board_name,
      document_type: element?.task_type_details,
      edit: true,
      attachments: element.attachments,
      owner: element.owner_details,
      owner_details: element?.owner_details,
      comments: element.comments,
      company: element?.buyer_company_details,
      internal_assignee: element?.internal_assignee_details,
      external_assignee: element?.external_assignee_details,
      taskColor: element?.color,
      board_priority: element?.board_priority,
      steps: element?.steps_count,
      todo_steps: element?.todo_steps_count,
      done_steps: element?.done_steps_count,
    });
  });

  const requestSearch = (searchedVal) => {
    const filteredRows = allRows.filter((row) => {
      return row.task_name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setMyTaskData(filteredRows);
  };

  const cancelSearch = () => {
    setSearched('');
    requestSearch(searched);
  };

  let late_tasks =
    tasks?.data?.length > 0
      ? tasks?.data?.filter(
          (item) =>
            new Date().toJSON().slice(0, 10).replace(/-/g, '-') >
            new Date(item.end_date).toJSON().slice(0, 10).replace(/-/g, '-'),
        )?.length
      : 0;
  let upcoming_tasks =
    tasks?.data?.length > 0
      ? tasks?.data?.filter(
          (item) =>
            new Date(item.start_date).toJSON().slice(0, 10).replace(/-/g, '-') >
            new Date().toJSON().slice(0, 10).replace(/-/g, '-'),
        )?.length
      : 0;
  let ongoing_tasks =
    tasks?.data?.length > 0
      ? tasks?.data?.filter(
          (item) =>
            new Date(item.start_date).toJSON().slice(0, 10).replace(/-/g, '-') <=
              new Date().toJSON().slice(0, 10).replace(/-/g, '-') &&
            new Date().toJSON().slice(0, 10).replace(/-/g, '-') <=
              new Date(item.end_date).toJSON().slice(0, 10).replace(/-/g, '-'),
        )?.length
      : 0;
  const isMobile = getDevice();

  const handleSelect = (name, event) => {
    if (name === 'task_type') {
      setType(event.target.value);
      dispatch(
        getFilteredTasks({
          user_id: user?.id,
          filterList: true,
          type: event.target.value,
          status: status,
        }),
      );
    } else if (name === 'status') {
      setStatus(event.target.value);
      dispatch(
        getFilteredTasks({
          user_id: user?.id,
          filterList: true,
          status: event.target.value,
          type: type,
        }),
      );
    }
  };

  const groupedTaskTypes = groupBy(only_actives, 'department');
  const sortedData = Object.fromEntries(
    Object.keys(groupedTaskTypes)
      .sort()
      .map((key) => [key, groupedTaskTypes[key]]),
  );

  return (
    <>
      {showLoader.show ? (
        <Loader />
      ) : (
        <main
          id="page"
          className={!onHome ? 'panel-view' : ''}
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
            <MyTasksOverview
              lateTasks={late_tasks}
              ongoingTasks={ongoing_tasks}
              upcomingTasks={upcoming_tasks}
            />
            <MyTasksTableActions
              searched={searched}
              requestSearch={requestSearch}
              cancelSearch={cancelSearch}
              display={display}
              toggleDisplay={toggleDisplay}
              handleStatusSelection={(event) => handleSelect('status', event)}
              handleTaskTypeSelection={(event) => handleSelect('task_type', event)}
              selectedStatus={status}
              selectedTaskType={type}
              taskTypes={Object.entries(sortedData)}
              refresh={refresh}
              onHome={onHome}
            />
          </div>
          {showLoader.show ? (
            <Loader />
          ) : tasks?.data?.length > 0 ? (
            display === 'list_view' && !isMobile ? (
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <MyTasksTable
                  data={myTaskData?.length > 0 ? myTaskData : allRows}
                  locale={tenant_locale}
                  currency={currency_symbol}
                  handleForm={handleEditForm}
                  taskFilter={0}
                  doRefresh={refresh}
                  showList={onHome}
                  selected_status={status}
                  selected_type={type}
                  withCalendarIcon
                />
              </div>
            ) : (
              <Grid
                container
                spacing={2}
              >
                {(allRows || []).map((task) => (
                  // TODO FIXME
                  // eslint-disable-next-line react/jsx-key
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={3}
                  >
                    <QueuesTaskCard
                      cardData={task}
                      handleForm={handleEditForm}
                      taskFilter={0}
                      showTaskTypes
                    />
                  </Grid>
                ))}
              </Grid>
            )
          ) : (
            <div
              className="d-flex justify-centre"
              style={{ marginTop: 40 }}
            >
              <strong>No Tasks to display here!</strong>
            </div>
          )}
        </main>
      )}
      <ProjectForm
        handleClose={handleClose}
        formData={formData}
        open={open}
        fromComponent="MyTasks"
        key={formData ? formData?.taskId : 'MyTasks'}
      />
    </>
  );
}
export default React.memo(MyTasks);
