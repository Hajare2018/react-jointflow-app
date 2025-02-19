import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import TableContainer from '@mui/material/TableContainer';
import { FaHubspot, FaSalesforce } from 'react-icons/fa';
import { requestProjectsInLiteView } from '../../Redux/Actions/documents-data';
import { setMessage, show, showPrompt } from '../../Redux/Actions/loader';
import { useDispatch, useSelector } from 'react-redux';
import {
  createProjectData,
  currencyFormatter,
  dateFormat,
  getDevice,
  getDuration,
  getPlurals,
} from '../../components/Utils';
import Dashboard from '../Dashboard';
import { Fab, Grid, Tooltip } from '@mui/material';
import {
  Add,
  ArchiveOutlined,
  EditOutlined,
  LaunchOutlined,
  PersonAddOutlined,
  TableChartOutlined,
  WarningRounded,
} from '@mui/icons-material';
import { completed } from '../../Redux/Actions/completed-value';
import { Link, useNavigate } from 'react-router-dom';
import { getAllUsers } from '../../Redux/Actions/user-info';
import ProjectsCard from '../../components/ProjectsCard';
import { getConnectedCrms } from '../../Redux/Actions/crm-data';
import HttpClient from '../../Api/HttpClient';
import MenuPopover from '../../components/MenuPopover';
import ProjectCloneForm from '../../components/ProjectCloneForm';
import requestSingleProject from '../../Redux/Actions/single-project';
import MsCrmLogo from '../../assets/icons/image.png';
import ConfirmDialog from '../../components/ProjectForm/Components/ConfirmDialog';
import { updateProject } from '../../Redux/Actions/create-project';
import ProjectFormModal from '../../components/ProjectFormModal';
import Loader from '../../components/Loader';
import UsersTable from '../../components/UsersTable';
import { stableSort, getComparator } from '../../component-lib/JFTable/JFTable';
import ProjectsTable from './ProjectsTable';
import ProjectsOverview from './ProjectsOverview';
import ProjectsTableActions from './ProjectsTableActions';
import { useTenantContext } from '../../context/TenantContext';
import { useUserContext } from '../../context/UserContext';

const useStyles = makeStyles(() => ({
  table: {
    minWidth: '100%',
  },
  root: {
    width: '100%',
  },
  container: {},
  fabButtons: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    padding: '0 12px 12px 0',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  fab: {
    backgroundColor: 'rgba(98,125, 175, 1.7)',
    '&:hover': {
      backgroundColor: '#3edab7',
    },
    '@media(max-width: 767px)': {
      right: 10,
      bottom: 10,
    },
  },
  fab_crm: {
    backgroundColor: '#ffffff',
    marginRight: 8,
    '&:hover': {
      backgroundColor: '#4a5b67',
    },
    '@media(max-width: 767px)': {
      right: 10,
      bottom: 68,
    },
    fontSize: '1.5rem',
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
}));

const menuItemArr = [
  {
    id: 1,
    label: 'Open Project',
    icon: <EditOutlined style={{ color: '#627daf' }} />,
  },
  {
    id: 2,
    label: 'Open In New Tab',
    icon: <LaunchOutlined style={{ color: '#627daf' }} />,
  },
  {
    id: 3,
    label: 'Archive',
    icon: <ArchiveOutlined style={{ color: '#627daf' }} />,
  },
  {
    id: 4,
    label: 'Save As Template',
    icon: <TableChartOutlined style={{ color: '#627daf' }} />,
  },
  {
    id: 5,
    label: 'Reassign',
    icon: <PersonAddOutlined style={{ color: '#627daf' }} />,
  },
];

const Projects = React.memo(function Projects() {
  const navigate = useNavigate();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { user, permissions } = useUserContext();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('target_close_date');
  const [closed, setClosed] = React.useState(false);
  const [totalValue, setTotalValue] = useState(null);
  const [totalRedFlags, setTotalRedFlags] = useState(null);
  const [display, setDisplay] = useState('list_view');
  const [open, setOpen] = useState(false);
  const [anchorAssignee, setAnchorAssignee] = React.useState(null);
  const [openProjectForm, setOpenProjectForm] = useState(false);
  const [modalData, setModalData] = useState('');
  const [id, setId] = useState(0);
  const [rows, setRows] = useState([]);
  const [searched, setSearched] = useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [boardData, setBoardData] = useState(null);
  const [save, setSave] = useState(false);
  const [archive, setArchive] = useState(false);
  const [selectedUser, setSelectedUser] = useState(user?.id);
  const [selectedType, setSelectedType] = useState(null);
  const [showUsers, setShowusers] = useState(false);
  const loader = useSelector((state) => state.showLoader);
  const message = useSelector((state) => state.messageData);

  const allProjects = useSelector((state) => state.liteViewProjectsData);
  const allUsers = useSelector((state) => state.allUsersData);
  let allRows = allProjects.data.length > 0 ? allProjects.data : [];
  const usersData = allUsers?.data?.length > 0 ? allUsers?.data : [];
  usersData?.sort((a, b) => {
    if (a.first_name.toLowerCase() < b.first_name.toLowerCase()) {
      return -1;
    }
    if (a.first_name.toLowerCase() > b.first_name.toLowerCase()) {
      return 1;
    }
    return 0;
  });
  const filteredUser = user?.user_access_group?.filter((item) => item.name === 'Admin') || [];
  const all_assignees = useSelector((state) => state.singleProjectData);

  const allPermissions = permissions?.group?.map((access) => access.permission);
  const is_manage_user =
    allPermissions?.filter((access) => access?.codename === 'manage_users') || [];

  const { tenant_locale, currency_symbol, crm_integrated, crm_system, slack_integrated } =
    useTenantContext();

  let projectValue = [];
  let red_flags = [];

  allRows.forEach((element) => {
    element.left_cards = element.total_cards - element.total_closed_cards;
    projectValue.push(element.project_value);
    red_flags.push(element.nb_red_flags);
  });

  useEffect(() => {
    setRows(allRows);
    setTotalValue(projectValue.reduce((a, b) => a + b, 0));
    setTotalRedFlags(red_flags.reduce((a, b) => a + b, 0));
  }, [allProjects]);

  const toggleDisplay = (view) => {
    setDisplay(view);
  };

  const isMobile = getDevice();
  const cachedOwner = localStorage.getItem('project_owner');
  const cachedType = localStorage.getItem('project_type');
  const cachedIsClosed = localStorage.getItem('is_project_closed') === 'true' ? true : false;

  React.useEffect(() => {
    window.pendo.initialize({
      visitor: {
        id: user?.id,
        email: user?.email,
        full_name: user?.first_name + ' ' + user?.last_name,
        role: user?.role,
        page: 'Projects',
      },
      account: { id: HttpClient.tenant() },
    });
    if (isMobile) {
      setDisplay('grid_view');
    }
    dispatch(show(true));
    setClosed(JSON.parse(cachedIsClosed));
    setSelectedType(cachedType);
    setSelectedUser(cachedOwner);
    if (cachedOwner === 'all') {
      dispatch(
        requestProjectsInLiteView({
          closedBoards: JSON.parse(cachedIsClosed) == null ? false : JSON.parse(cachedIsClosed),
          project_type: cachedType == null ? null : cachedType,
        }),
      );
    } else {
      dispatch(
        requestProjectsInLiteView({
          closedBoards: JSON.parse(cachedIsClosed) == null ? false : JSON.parse(cachedIsClosed),
          owner: cachedOwner == null ? user?.id : cachedOwner,
          project_type: cachedType == null ? null : cachedType,
          my_team_boards: cachedOwner == null ? false : cachedOwner === 'my_team_boards',
          paused: cachedOwner ? false : cachedOwner === 'paused',
        }),
      );
    }
    dispatch(getAllUsers({ onlyStaff: true }));
  }, []);

  const handleClick = (event, data) => {
    setBoardData(data);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClickMenuItem = (id) => {
    if (id == 1) {
      openProject({ id: boardData?.id });
    } else if (id == 2) {
      checkSlackConnection();
      window.open(`/board/?id=${boardData?.id}&navbars=True&actions=True`, '_blank');
    } else if (id == 3) {
      handleArchive({ close: false });
    } else if (id == 4) {
      dispatch(requestSingleProject({ id: boardData?.id, header: true }));
      setTimeout(() => {
        dispatch(requestSingleProject({ id: boardData?.id }));
      }, 2000);
      setSave(true);
    } else if (id == 5) {
      dispatch(getAllUsers({ onlyStaff: true }));
      setShowusers(true);
    }
  };

  const handleCloseUsers = () => {
    setShowusers(false);
  };

  const closeSaveModal = () => {
    setSave(false);
  };

  const requestSearch = (searchedVal) => {
    const filteredRows = allRows.filter((row) => {
      return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    if (!filteredRows.length) {
      dispatch(setMessage('No Record(s) found!'));
    }
    setRows(filteredRows);
  };

  const cancelSearch = () => {
    setSearched('');
    requestSearch(searched);
  };

  const handleOpenProjectForm = (e) => {
    setModalData(e);
    setOpenProjectForm(true);
  };

  const handleCloseProjectForm = () => {
    setOpenProjectForm(false);
  };

  const openProject = (e) => {
    dispatch(show(true));
    setId(e.id);
    dispatch(completed(e.id));
    setOpen(true);
    checkSlackConnection();
    dispatch(requestSingleProject({ id: e.id, header: true }));
  };

  function checkSlackConnection() {
    return slack_integrated ? dispatch(getConnectedCrms({ crm: 'slack', fromBoard: true })) : '';
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSwitch = (event) => {
    dispatch(show(true));
    setClosed(event.target.checked);
    localStorage.setItem('is_project_closed', event.target.checked);
    if (selectedUser === 'my_team_boards') {
      dispatch(
        requestProjectsInLiteView({
          closedBoards: closed ? false : true,
          my_team_boards: true,
        }),
      );
    } else if (selectedUser === 'all') {
      dispatch(
        requestProjectsInLiteView({
          closedBoards: closed ? false : true,
        }),
      );
    } else {
      dispatch(
        requestProjectsInLiteView({
          closedBoards: closed ? false : true,
          owner: selectedUser,
        }),
      );
    }
  };

  const openDashboard = (id) => {
    openProject({ id: id });
  };

  const handleArchive = (e) => {
    if (e.close) {
      archiveProject();
      setArchive(!archive);
    } else {
      setArchive(!archive);
    }
  };

  const archiveProject = () => {
    dispatch(show(true));
    const projectRequest = {
      archived: 'True',
    };
    dispatch(
      updateProject({
        id: boardData?.id,
        data: projectRequest,
        filterByTemplate: false,
        archivedTemplates: false,
        closedBoards: false,
        liteview: true,
        filter: selectedUser,
      }),
    );
  };

  const handleSelectUser = (event) => {
    dispatch(show(true));
    setSelectedUser(event.target.value);
    localStorage.setItem('project_owner', event.target.value);
    if (event.target.value === 'my_team_boards') {
      dispatch(
        requestProjectsInLiteView({
          closedBoards: closed,
          my_team_boards: true,
          project_type: selectedType,
        }),
      );
    } else if (event.target.value === 'paused') {
      dispatch(
        requestProjectsInLiteView({
          closedBoards: closed,
          paused: true,
          project_type: selectedType,
        }),
      );
    } else if (event.target.value === 'all') {
      dispatch(
        requestProjectsInLiteView({
          closedBoards: closed,
          project_type: selectedType,
        }),
      );
    } else {
      dispatch(
        requestProjectsInLiteView({
          closedBoards: closed,
          owner: event.target.value,
          project_type: selectedType,
        }),
      );
    }
  };

  const handleSelectedType = (event) => {
    dispatch(show(true));
    setSelectedType(event.target.value);
    localStorage.setItem('project_type', event.target.value);
    dispatch(
      requestProjectsInLiteView({
        closedBoards: closed,
        my_team_boards: selectedUser === 'my_team_boards' ? true : false,
        paused: selectedUser === 'paused' ? true : false,
        owner: selectedUser,
        project_type: event.target.value,
      }),
    );
  };

  const createdData = rows.map((row) =>
    createProjectData(
      row?.id,
      row?.name,
      currencyFormatter(
        tenant_locale,
        row?.project_value == null ? 0 : row?.project_value,
        currency_symbol,
      ),
      row?.owner_name,
      dateFormat(new Date(row?.target_close_date), true),
      closed && row?.actual_close_date == null
        ? 'Unavailable'
        : closed && row?.actual_close_date !== null
          ? dateFormat(new Date(row?.actual_close_date), true)
          : !closed && row?.board_likely_end_date == null
            ? 'Unavailable'
            : dateFormat(new Date(row?.board_likely_end_date), true),
      closed && row?.actual_close_date == null
        ? getPlurals(
            getDuration(new Date(row?.actual_close_date), new Date(row?.created_at)),
            'Day',
          )
        : getPlurals(getDuration(new Date(), new Date(row?.created_at)), 'Day'),
      row?.actual_close_date == null ? 'NA' : dateFormat(new Date(row?.actual_close_date), true),
      row?.forecast_status?.charAt(0)?.toUpperCase() + row?.forecast_status?.slice(1),
      row?.total_cards,
      row?.project_type,
      row?.total_closed_cards,
      row?.percentage_completed + '%',
      dateFormat(new Date(row?.created_at), true),
    ),
  );

  const csvData = [
    [
      'ID',
      'Name',
      'Value',
      'Owner',
      'Target Close Date',
      'Projected End Date',
      'Duration',
      'Actual Close Date',
      'Forecast Status',
      'Total Tasks',
      'Project Type',
      'Total Closed Tasks',
      'Percentage Complete',
      'Created On',
    ],
  ];
  const newData = csvData.concat(createdData);

  const handleShowAssignees = (event, data) => {
    dispatch(showPrompt(true));
    setBoardData(data);
    setAnchorAssignee(event.currentTarget);
    dispatch(requestSingleProject({ id: data?.id, ext_team_view: true }));
  };

  const handleHideAssignees = () => {
    setAnchorAssignee(null);
  };
  const showAssignees = Boolean(anchorAssignee);
  const assign_id = showAssignees ? 'simple-popover' : undefined;

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
        <div className="overview">
          <ProjectsOverview
            projectCount={allRows.length}
            totalRedFlags={totalRedFlags}
            totalValue={totalValue}
          />
          <ProjectsTableActions
            searched={searched}
            requestSearch={requestSearch}
            cancelSearch={cancelSearch}
            handleSwitch={handleSwitch}
            handleSelectUser={handleSelectUser}
            user={user}
            usersData={usersData}
            selectedType={selectedType}
            handleSelectedType={handleSelectedType}
            newData={filteredUser.length > 0 ? newData : undefined}
            display={display}
            toggleDisplay={toggleDisplay}
            closed={closed}
            selectedUser={selectedUser}
          />
        </div>
        {loader.show ? (
          <Loader />
        ) : rows?.length > 0 ? (
          <div
            className="tour-project-table mt-1"
            style={{ flex: 1, overflow: 'hidden' }}
          >
            {display === 'list_view' ? (
              <TableContainer
                style={{
                  height: '100%',
                  // paddingBottom: 70,
                  maxHeight: 'calc(100vh - 96px - 214px)',
                }}
              >
                {closed && allRows?.length == 0 ? (
                  <div
                    className="d-flex justify-centre"
                    style={{ marginTop: 200 }}
                  >
                    <h4>No Projects has been closed yet!</h4>
                  </div>
                ) : (
                  <ProjectsTable
                    data={stableSort(rows.length > 0 ? rows : [], getComparator(order, orderBy))}
                    onHeaderCellClick={handleRequestSort}
                    orderedBy={orderBy}
                    orderDirection={order}
                    showingClosedProjects={closed}
                    onProjectClick={openProject}
                    onMoreActionsClick={handleClick}
                    handleShowAssignees={handleShowAssignees}
                    handleHideAssignees={handleHideAssignees}
                    boardData={boardData}
                    assignId={assign_id}
                    showAssignees={showAssignees}
                    anchorAssignee={anchorAssignee}
                    allAssignees={all_assignees}
                  />
                )}
              </TableContainer>
            ) : (
              <Grid
                container
                spacing={2}
              >
                {stableSort(rows.length > 0 ? rows : allRows, getComparator(order, orderBy)).map(
                  (row, index) => (
                    <Grid
                      key={index}
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={3}
                    >
                      <ProjectsCard
                        cardData={row}
                        openBoard={openDashboard}
                      />
                    </Grid>
                  ),
                )}
              </Grid>
            )}
          </div>
        ) : (
          <div className="mt-6 text-centre">
            <strong>{message.message}</strong>
          </div>
        )}
        <div className={classes.fabButtons}>
          {crm_integrated ? (
            <Tooltip
              className="tour-crm-table"
              title={`Pull from ${crm_system}`}
              placement="left"
              arrow
            >
              <Fab
                className={classes.fab_crm}
                size={isMobile ? 'small' : 'medium'}
                classes="tour-create-project"
                aria-label="crm"
                onClick={() => {
                  navigate('/crm_deals');
                }}
              >
                <Link
                  to="/crm_deals"
                  target={'_self'}
                >
                  {crm_system === 'hubspot' ? (
                    <FaHubspot
                      style={{ color: '#fa7820' }}
                      className="add-crm"
                    />
                  ) : crm_system === 'salesforce' ? (
                    <FaSalesforce
                      style={{ color: '#1798c1' }}
                      className="add-crm"
                    />
                  ) : crm_system === 'mscrm' ? (
                    <img
                      src={MsCrmLogo}
                      className="h-7 w-7 add-crm"
                    />
                  ) : null}
                </Link>
              </Fab>
            </Tooltip>
          ) : null}
          <Tooltip
            className="tour-project-add"
            title={'Create New Project'}
            placement="left"
            arrow
          >
            <Fab
              className={classes.fab}
              size={isMobile ? 'small' : 'medium'}
              onClick={() => handleOpenProjectForm({ add: true })}
              aria-label="add"
            >
              <Add
                style={{ width: 25, height: 25, color: '#ffffff' }}
                className="add-project"
              />
            </Fab>
          </Tooltip>
        </div>
      </main>

      <Dashboard
        key={id}
        open={open}
        id={id}
        handleClose={handleClose}
        close_boards={closed}
        owner={selectedUser === null ? user.id : selectedUser}
      />
      <ProjectFormModal
        open={openProjectForm}
        data={modalData}
        handleClose={handleCloseProjectForm}
      />
      <MenuPopover
        data={is_manage_user.length > 0 ? menuItemArr : menuItemArr.slice(0, -2)}
        anchorEl={anchorEl}
        handleClose={handleCloseMenu}
        getClicked={handleClickMenuItem}
      />
      <ProjectCloneForm
        open={save}
        handleClose={closeSaveModal}
        data={boardData}
      />
      <UsersTable
        open={showUsers}
        handleClose={handleCloseUsers}
        board_data={boardData}
      />
      <ConfirmDialog
        open={archive}
        dialogTitle={'Archive'}
        onlyAdd={false}
        addAndReplace={false}
        dialogContent={
          <div className="text-centre">
            <WarningRounded
              style={{
                color: 'lightcoral',
                height: '4rem',
                width: '4rem',
              }}
            />
            <p>Warning, are you sure you want to archive this project?</p>
            <p>Archived projects cannot be re-opened!</p>
          </div>
        }
        handleClose={handleArchive}
      />
    </>
  );
});

export default Projects;
