import React, { useEffect, useState } from 'react';
import { FaFileAlt, FaPoundSign, FaBell, FaListUl } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import requestProject from '../../Redux/Actions/dashboard-data';
import ProjectForm from '../../components/ProjectForm/ProjectForm';
import { show } from '../../Redux/Actions/loader';
import { currencyFormatter, getCurrencySymbol, getDevice } from '../../components/Utils';
import Loader from '../../components/Loader';
import { Grid, IconButton, Tooltip } from '@mui/material';
import { ViewComfy } from '@mui/icons-material';
import TasksCard from '../../components/TasksCard';
import AddToCalendarModal from '../../components/AddToCalendarModal';
import HttpClient from '../../Api/HttpClient';
import getSingleTask from '../../Redux/Actions/single-task';
import { requestDocumentsType } from '../../Redux/Actions/documents-type';
import SearchBar from '../../component-lib/SearchBar/SearchBar';
import AppRadioGroup from '../../components/AppRadioGroup';
import LegalTasksTable from './LegalTasksTable';
import { getAllUsers } from '../../Redux/Actions/user-info';
import { getComments } from '../../Redux/Actions/comments';
import { requestTaskSteps } from '../../Redux/Actions/task-info';
import { getSingleCardDocs } from '../../Redux/Actions/document-upload';
import { useTenantContext } from '../../context/TenantContext';
import { useUserContext } from '../../context/UserContext';

const legalFiltersArr = [
  {
    id: 0,
    name: 'All',
    color: '#33e0b3',
  },
  {
    id: 1,
    name: 'Completed',
    color: '#33e0b3',
  },
  {
    id: 2,
    name: 'Upcoming',
    color: '#33e0b3',
  },
];

function Legal() {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [openCal, setOpenCal] = React.useState(false);
  const [formData, setFormData] = React.useState([]);
  const [filters, setFilters] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [display, setDisplay] = useState('list_view');
  const projectData = useSelector((state) => state.dashboardData);
  const allData = projectData.data ? projectData.data : [];
  const showLoader = useSelector((state) => state.showLoader);
  const { user } = useUserContext();
  // console.log("user----------",user);
  
  const { tenant_locale, currency_symbol } = useTenantContext();

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
        page: 'Legal Dashboard',
      },
      account: { id: HttpClient.tenant() },
    });
    refresh();
  }, []);

  const handleFilters = (id) => {
    setFilters(id);
    dispatch(show(true));
    if (id == 0) {
      dispatch(requestProject({ isLegal: true }));
    } else if (id == 1) {
      dispatch(requestProject({ isLegal__completed: true }));
    } else if (id == 2) {
      dispatch(requestProject({ isLegal__upcoming: true }));
    }
  };

  const handleOpenCalendar = (e) => {
    setFormData(e);
    setOpenCal(true);
  };
  const closeCalendar = () => {
    setOpenCal(false);
  };
  const refresh = () => {
    dispatch(show(true));
    if (filters == 0) {
      dispatch(requestProject({ isLegal: true }));
    }
    if (filters == 1) {
      dispatch(requestProject({ isLegal__completed: true }));
    }
    if (filters == 2) {
      dispatch(requestProject({ isLegal__upcoming: true }));
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditForm = (edit, display) => {
    dispatch(show(true));
    dispatch(requestDocumentsType());
    dispatch(getAllUsers({ onlyStaff: true }));
    dispatch(getComments({ id: edit?.taskId }));
    dispatch(getSingleCardDocs({ doc_id: edit?.taskId, archived: false }));
    dispatch(requestTaskSteps({ id: edit?.taskId, fetchByTaskType: false }));
    dispatch(
      getSingleTask({
        card_id: edit?.taskId,
        task_info: true,
      }),
    );
    setFormData(edit);
    setOpen(display);
  };

  const allTasks = allData.length > 0 ? allData : [];
  const completedTasks = allTasks?.filter((task) => task.is_completed == true);
  const pastTasks = allTasks?.filter(
    (task) => new Date(task.end_date) < new Date() && task.is_completed == false,
  );
  const totalNotifications = completedTasks?.length + pastTasks?.length;
  let cardData = [];
  let projectValues = [];
  allTasks.forEach(
    (element) => (
      (element.taskTypeName = element?.task_type_details?.custom_label),
      (element.owner_name = element?.owner_details?.first_name),
      projectValues.push(element.project_value)
    ),
  );
  let totalValue = projectValues.reduce((a, b) => a + b, 0);
  allTasks?.forEach((element) =>
    cardData.push({
      task_name: element?.title,
      start_date: element?.start_date,
      end_date: element?.end_date,
      attachment_count: element?.attachments?.length,
      project_value: element?.project_value,
      assignee_pic: element?.internal_assignee_details?.avatar,
      internal_assignee: element?.internal_assignee_details,
      external_assignee: element?.external_assignee_details,
      task_status: element?.is_completed,
      edit: true,
      task_id: element?.id,
      board_id: element?.board,
      board_name: element?.board_name,
      task_type_name: element?.task_type_details?.custom_label,
      task_type: element?.task_type_details?.id,
      attachments: element?.attachments,
      description: element?.description,
      buyer_company: element?.buyer_company_details,
      taskColor: element?.task_type_details?.colors,
      owner: element?.owner_details,
      comments: element?.comments,
    }),
  );
  const isMobile = getDevice();

  return (
    <>
      <main
        id="page"
        className="panel-view"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          height: 'calc(100% - 80px)',
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
          <div className="analytics-card-container">
            <div className="analytics-card analytics-card__one">
              <div className="analytics-card__content">
                <p>Total Tasks</p>
                <h1>{allTasks?.length}</h1>
              </div>
              <div className="analytics-card__icon">
                <FaFileAlt
                  size={32}
                  color={'#3edab7'}
                />
              </div>
            </div>
            <div className="analytics-card analytics-card__two">
              <div className="analytics-card__content">
                <p>Total Value</p>
                <h1>{currencyFormatter(tenant_locale, totalValue, currency_symbol)}</h1>
              </div>
              <div className="analytics-card__icon">
                <strong>
                  {currency_symbol === null ? (
                    <FaPoundSign size={40} />
                  ) : (
                    getCurrencySymbol(currency_symbol)
                  )}
                </strong>
              </div>
            </div>
            <div className="analytics-card analytics-card__three">
              <div className="analytics-card__content">
                <p>Overdue Tasks</p>
                <h1>{totalNotifications}</h1>
              </div>
              <div className="analytics-card__icon">
                <FaBell
                  size={32}
                  color={'#fc8c8a'}
                />
              </div>
            </div>
          </div>
          <div className="d-flex justify-space-between mt-1">
            <div className={`mb-2 ${isMobile && 'width-33'}`}>
              <SearchBar
                className="search-bar search"
                value={searchValue}
                onChange={(searchVal) => setSearchValue(searchVal.toLowerCase())}
                onCancelSearch={() => setSearchValue('')}
              />
            </div>
            <AppRadioGroup
              filters={legalFiltersArr}
              getFilters={handleFilters}
              tabId={0}
            />
            {!isMobile && (
              <div className="d-flex">
                <div
                  className="d-flex justify-centre left-btn"
                  style={{
                    backgroundColor: display === 'list_view' ? '#6385b7' : '#dadde9',
                  }}
                >
                  <Tooltip
                    title={'Show List View'}
                    placement="top"
                    arrow
                  >
                    <IconButton onClick={() => toggleDisplay('list_view')}>
                      <FaListUl
                        style={{
                          color: display === 'list_view' ? '#ffffff' : '#6385b7',
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </div>
                <div
                  className="d-flex justify-centre right-btn"
                  style={{
                    backgroundColor: display === 'grid_view' ? '#6385b7' : '#dadde9',
                  }}
                >
                  <Tooltip
                    title={'Show Grid View'}
                    placement="top"
                    arrow
                  >
                    <IconButton onClick={() => toggleDisplay('grid_view')}>
                      <ViewComfy
                        style={{
                          color: display === 'grid_view' ? '#ffffff' : '#6385b7',
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            )}
          </div>
        </div>
        <div
          className="data-table-container"
          style={{ flex: 1, overflow: 'hidden' }}
        >
          {showLoader.show ? (
            <Loader />
          ) : allData?.length > 0 ? (
            display === 'list_view' && !isMobile ? (
              <LegalTasksTable
                data={
                  searchValue
                    ? allTasks.filter((task) => task.title.toLowerCase().includes(searchValue))
                    : allTasks
                }
                locale={tenant_locale}
                currency={currency_symbol}
                handleForm={handleEditForm}
                legalFilter={filters}
                openCalendar={handleOpenCalendar}
                doRefresh={refresh}
                withCalendarIcon
              />
            ) : (
              <Grid
                container
                spacing={2}
              >
                {(cardData || []).map((task) => (
                  // TODO FIXME
                  // eslint-disable-next-line react/jsx-key
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={3}
                  >
                    <TasksCard
                      cardData={task}
                      locale={tenant_locale}
                      currency={currency_symbol}
                      handleForm={handleEditForm}
                      openCalendar={handleOpenCalendar}
                      legalFilter={filters}
                      withCalendarIcon
                    />
                  </Grid>
                ))}
              </Grid>
            )
          ) : (
            <div className="text-centre">
              <strong>Loading...</strong>
            </div>
          )}
        </div>
      </main>
      <ProjectForm
        handleClose={handleClose}
        formData={formData}
        open={open}
        fromComponent="Legal"
        key={formData ? formData?.taskId : 'Legal'}
      />
      <AddToCalendarModal
        open={openCal}
        data={formData}
        handleClose={closeCalendar}
      />
    </>
  );
}

export default React.memo(Legal);
