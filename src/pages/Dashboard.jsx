import { Avatar, Dialog, Grid, Paper, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardEndSection from '../components/DashboardEndSection';
import DashboardHeader from '../components/DashboardHeader';
import DashboardTable from '../components/DashboardTable';
import requestSingleProject from '../Redux/Actions/single-project';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';
import AddProjectForm from '../components/AddProjectForm';
import { show } from '../Redux/Actions/loader';
import { FaIndustry } from 'react-icons/fa';
import { requestBoardComments } from '../Redux/Actions/comments';
import { fetchProjectsInsight, requestContentsList } from '../Redux/Actions/dashboard-data';
import CongratulationsModal from '../components/CongratulationsModal';
import { updateProject } from '../Redux/Actions/create-project';
import { ArrowBackIosOutlined, VerticalSplitOutlined } from '@mui/icons-material';
import CreateSlackChannel from '../components/SlackStuffs/CreateSlackChannel';
import { requestSlackHistory } from '../Redux/Actions/slack-stuffs';
import HttpClient from '../Api/HttpClient';
import { requestCrmSync } from '../Redux/Actions/crm-data';
import DashboardApexChart from '../components/ChartComponent/DashboardApexChart';
import DashboardChat from '../components/DashboardChat';
import MeddpiccView from '../components/MeddpiccView';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useTenantContext } from '../context/TenantContext';
import { useUserContext } from '../context/UserContext';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'sticky',
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

function Dashboard({ open, handleClose, id }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [display, setDisplay] = useState(false);
  const [complete, setComplete] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const [showFulltable, setShowFullTable] = useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const [openChat, setOpenChat] = useState({
    createSlackChannel: false,
    openSlackChat: false,
    openTimeline: false,
    ganttChart: true,
    contentPreview: false,
    insights: false,
    contentsTable: false,
    editForm: false,
    meddpicc_view: false,
  });

  const projectData = useSelector((state) => state.singleProjectData);
  const loader = useSelector((state) => state.showLoader);
  const connectedCrm = useSelector((state) => state.crmConnectedData);
  const { slack_integrated: isSlackIntegrated } = useTenantContext();
  const projectWithHeader = useSelector((state) => state.singleProjectWithHeader);
  const thisProject = projectWithHeader?.data?.length > 0 ? projectWithHeader?.data?.[0] : {};

  useEffect(() => {
    window.pendo.initialize({
      visitor: {
        id: user?.id,
        email: user?.email,
        full_name: user?.first_name + ' ' + user?.last_name,
        role: user?.role,
        page: 'Project Dashboard',
      },
      account: { id: HttpClient?.tenant },
    });
  }, []);

  useEffect(() => {
    if (id && id > 0) {
      dispatch(show(true));
      dispatch(requestSingleProject({ id: id, header: false }));
      if (display) {
        setDisplay(false);
      }
    }
  }, [id]);

  useEffect(() => {
    if (
      projectData?.data?.[0]?.cards?.length > 0 &&
      allEqual(projectData?.data?.[0]?.cards) == true
    ) {
      if (projectData?.data?.[0]?.closed) {
        setComplete(false);
      } else {
        setComplete(true);
      }
    }
  }, [projectData]);

  const handleComplete = () => {
    setComplete(!complete);
  };

  const handleCloseChat = () => {
    setOpenChat({
      createSlackChannel: false,
    });
  };

  const { user } = useUserContext();

  const allData = projectData?.data?.length > 0 ? projectData?.data.filter((d) => d.id === id) : [];
  const { crm_system } = useTenantContext();

  const markCompleted = (e) => {
    setTimeout(() => {
      if (e.closed) {
        doComplete(false);
      } else {
        doComplete(true);
      }
    }, 1000);
  };

  const doComplete = (complete) => {
    dispatch(show(true));
    const projectRequest = {
      closed: complete ? 'True' : 'False',
    };
    dispatch(updateProject({ id: id, data: projectRequest, filterByTemplate: false }));
    if (!loader.show) {
      setComplete(false);
    }
  };

  const allEqual = (arr) => {
    if (arr.length > 0) {
      return (arr || [])?.every((val) => val.is_completed == true);
    } else {
      return false;
    }
  };

  const allTasks = allData.length > 0 ? allData : [];
  const tableData = [];
  const chartData = [];
  const commentData = [];
  let projectName = '';
  // TODO REVIEW
  // eslint-disable-next-line no-unused-vars
  let projectValue = 0;
  let companyName = '';
  let companyIcon = '';
  // eslint-disable-next-line no-unused-vars
  let closedDate = '';
  // eslint-disable-next-line no-unused-vars
  let completion_percent = '';
  // eslint-disable-next-line no-unused-vars
  let predicted_date = '';
  // eslint-disable-next-line no-unused-vars
  let alert_flag = '';
  // eslint-disable-next-line no-unused-vars
  let red_flag = '';
  // eslint-disable-next-line no-unused-vars
  let green_flag = '';
  // eslint-disable-next-line no-unused-vars
  let companyData = {};
  // eslint-disable-next-line no-unused-vars
  let external_assignee = [];
  // eslint-disable-next-line no-unused-vars
  let internal_assignee = [];

  allTasks?.forEach((element) => {
    projectName = element?.name;
    projectValue = element?.project_value;
    companyName = element?.buyer_company_details?.name;
    companyIcon = element?.buyer_company_details?.company_image;
    companyData = element?.buyer_company_details;
    closedDate = element?.target_close_date;
    alert_flag = element?.nb_amber_flags;
    red_flag = element?.nb_red_flags;
    green_flag = element?.nb_green_flags;
    external_assignee = element?.ext_assignee_team;
    internal_assignee = element?.int_assignee_team;
    completion_percent = element?.percentage_completed;
    predicted_date = element?.board_likely_end_date == null ? 'NA' : element?.board_likely_end_date;
    element?.cards?.forEach((element) => {
      tableData.push({
        task_name: element?.title,
        start_date: element?.start_date,
        end_date: element?.end_date,
        display_end_date: element?.display_end_date,
        attachment_count: element?.document_count,
        assignee_pic: element?.internal_assignee_details?.avatar,
        internal_assignee: element?.internal_assignee_details,
        external_assignee: element?.external_assignee_details,
        deal_police: element?.external_assignee_deal_police?.deal_police?.[0],
        last_completion_time: element?.task_type_details?.last_completion_time,
        avg_completion_time: element?.task_type_details?.last5_avg_completion_time,
        task_status: element?.is_completed,
        edit: true,
        task_id: element?.id,
        board_id: id,
        task_type_name: element?.task_type_details?.custom_label,
        task_type: element?.task_type_details?.id,
        attachments: element?.last_uploaded_document,
        description: element?.description,
        buyer_company: element?.buyer_company_details,
        taskColor: element?.task_type_details?.colors,
        owner: element?.owner_details,
        comments: element?.comments,
        steps: element?.steps_count,
        side: element?.side,
        todo_steps: element?.todo_steps_count,
        done_steps: element?.done_steps_count,
        client_visible: element?.client_visible,
      });
      chartData.push({
        task_id: element?.id,
        task_name: element?.title,
        color: element?.task_type_details?.color,
        start_date: element?.start_date,
        end_date: element?.end_date,
        display_end_date: element?.display_end_date,
        actual_completion_date: element?.actual_completion_date,
        is_completed: element?.is_completed,
        last_doc: element?.last_uploaded_document,
        task_timing: element?.task_timing,
      });
      commentData.push(element?.comments);
    });
  });

  const closeBoard = () => {
    dispatch(requestSingleProject({ id: 0, header: true }));
    setOpenChat({
      createSlackChannel: false,
      openSlackChat: false,
      openTimeline: false,
      ganttChart: true,
      contentPreview: false,
    });
    setShowExtra(false);
    setShowFullTable(false);
    handleClose();
  };

  const handleRightViews = (e) => {
    setOpenChat({
      createSlackChannel: e.createSlackChannel,
      openSlackChat: e.slackChat,
      openTimeline: e.timeline,
      ganttChart: e.ganttView,
      insights: e.insight,
      contentsTable: e.contents,
      editForm: e.form,
      meddpicc_view: e.show_meddpicc,
    });
    if (showExtra) {
      setShowExtra(false);
      setShowFullTable(false);
    }
    if (e.form) {
      setFormData({
        board_id: id,
        name: allTasks?.[0]?.name,
        value: allTasks?.[0]?.project_value,
        description: allTasks?.[0]?.description,
        company_name: allTasks?.[0]?.buyer_company_details?.name,
        company_id: allTasks?.[0]?.buyer_company_details?.id,
        target_close_date: allTasks?.[0]?.target_close_date,
        green_flag: allTasks?.[0]?.nb_green_flags,
        red_flag: allTasks?.[0]?.nb_red_flags,
        amber_flag: allTasks?.[0]?.nb_amber_flags,
        edit_project: true,
        archived: allTasks?.[0]?.archived,
        crm_id: allTasks?.[0]?.crm_id,
      });
    } else if (e.contents) {
      dispatch(requestContentsList({ id: id, fetchContent: false }));
      setFormData({ edit_project: true });
    } else if (e.slackChat) {
      dispatch(
        requestSlackHistory({
          slack_channel_id: projectData?.data?.[0]?.slack_channel_id,
        }),
      );
    } else if (e.insight) {
      dispatch(show(true));
      dispatch(fetchProjectsInsight({ board_id: id }));
    } else if (e.timeline) {
      dispatch(
        requestBoardComments({
          board_id: projectData?.data?.[0]?.id,
        }),
      );
    } else if (e.crm) {
      dispatch(
        requestCrmSync({
          data: {
            crm: crm_system,
            board_id: projectData?.data?.[0]?.id,
          },
        }),
      );
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={closeBoard}
        fullWidth
        maxWidth="xxl"
      >
        <AppBar className={classes.appBar}>
          <Toolbar className="justify-space-between">
            {!allData.length ? (
              <strong>Loading...</strong>
            ) : (
              <Tooltip
                title={`(${companyName})`}
                placement={'right'}
              >
                <strong className="d-flex font-bold">
                  {companyIcon ? (
                    <Avatar
                      src={companyIcon}
                      style={{ height: 30, width: 30, marginRight: 8 }}
                    />
                  ) : (
                    <FaIndustry style={{ color: '#ffffff', marginRight: 8 }} />
                  )}
                  <strong data-testid="text">{projectName}</strong>
                </strong>
              </Tooltip>
            )}
            <IconButton
              edge="start"
              color="inherit"
              onClick={closeBoard}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div className="overview h-screen">
          <div style={{ padding: 15, backgroundColor: '#ffffff' }}>
            <div
              style={{
                position: 'sticky',
                top: 65,
                zIndex: 999,
                width: '100%',
                backgroundColor: '#ffffff',
              }}
            >
              {Object.keys(thisProject).length > 0 ? (
                <DashboardHeader
                  board={projectData?.data?.[0]?.id}
                  projectData={projectData?.data?.[0]}
                  slackIntegrated={isSlackIntegrated}
                  connectedCrm={connectedCrm?.data?.details}
                  tenantCrm={crm_system}
                  handleRightView={handleRightViews}
                  // view={{
                  //   gantt: openChat.ganttChart,
                  //   table: showFulltable && showExtra,
                  // }}
                />
              ) : (
                <SkeletonTheme
                  width={'100%'}
                  baseColor="#ffffff"
                  highlightColor="#aeaeae"
                >
                  <div className="d-flex">
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <Skeleton
                        key={n}
                        count={1}
                        height={100}
                        width={370}
                        className="m-2"
                      />
                    ))}
                  </div>
                </SkeletonTheme>
              )}
              <div style={{ height: 5 }} />
            </div>
            {!allData.length ? (
              <SkeletonTheme
                width={'100%'}
                baseColor="#ffffff"
                highlightColor="#aeaeae"
              >
                <Skeleton
                  count={25}
                  height={25}
                />
                <Skeleton
                  count={1}
                  height={10}
                />
              </SkeletonTheme>
            ) : (
              <Paper
                elevation={3}
                component="div"
                id="dashboard-paper"
                className="p-3"
              >
                <Grid
                  container
                  direction="row"
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={showExtra ? 12 : 7}
                  >
                    <div
                      style={{
                        borderRight: '2px solid #aeaeae',
                      }}
                    >
                      <div className="mr-3">
                        <DashboardTable
                          tableData={tableData}
                          chartData={chartData}
                          project_data={allData}
                          board={id}
                          closeChat={handleCloseChat}
                          showExtra={showFulltable}
                        />
                      </div>
                    </div>
                    <Tooltip
                      title={showExtra ? 'Collapse table' : 'Expand table'}
                      open={showTooltip}
                      disableHoverListener
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      <div
                        style={{
                          backgroundColor: ' #aeaeae',
                          color: '#ffffff',
                          cursor: 'pointer',
                          float: 'right',
                          position: 'relative',
                          bottom: '50%',
                          borderTopLeftRadius: '50%',
                          borderBottomLeftRadius: '50%',
                          right: 0,
                          padding: 5,
                        }}
                        onClick={() => {
                          setShowExtra(!showExtra);
                          setShowFullTable(!showFulltable);
                          setShowTooltip(false);
                        }}
                      >
                        {showExtra ? (
                          <ArrowBackIosOutlined />
                        ) : (
                          <VerticalSplitOutlined className="white-color h-5 w-5" />
                        )}
                      </div>
                    </Tooltip>
                  </Grid>
                  {!showExtra && (
                    <Grid
                      className="overflowBox"
                      item
                      xs={12}
                      sm={12}
                      md={showExtra ? 0 : 5}
                    >
                      {openChat.ganttChart ? (
                        <div
                          style={{
                            marginTop: 27,
                            height: 'calc(100% - 8vh)',
                            flex: 1,
                          }}
                        >
                          <DashboardApexChart
                            dashboardTasks={chartData}
                            height={'100%'}
                            forBoards
                          />
                        </div>
                      ) : openChat.editForm ? (
                        <AddProjectForm
                          data={formData}
                          forCrm={false}
                          tab={0}
                          forEdit
                        />
                      ) : openChat.insights ? (
                        <DashboardEndSection
                          forDashboard
                          id={projectData?.data?.[0]?.id}
                        />
                      ) : openChat.contentsTable ? (
                        <AddProjectForm
                          data={formData}
                          forCrm={false}
                          tabVal={1}
                          forContent
                        />
                      ) : openChat.openSlackChat ? (
                        <DashboardChat forSlack />
                      ) : openChat.openTimeline ? (
                        <DashboardChat forTimeline />
                      ) : openChat.meddpicc_view ? (
                        <MeddpiccView />
                      ) : !showExtra ? (
                        <div
                          style={{
                            marginTop: 27,
                            height: 'calc(100% - 8vh)',
                            flex: 1,
                          }}
                        >
                          <DashboardApexChart
                            dashboardTasks={chartData}
                            height={'100%'}
                            forBoards
                          />
                        </div>
                      ) : (
                        ''
                      )}
                    </Grid>
                  )}
                </Grid>
              </Paper>
            )}
          </div>
        </div>
        <CongratulationsModal
          open={complete}
          handleClose={handleComplete}
          isCompleted={markCompleted}
          data={projectData}
        />
        <CreateSlackChannel
          open={openChat.createSlackChannel}
          handleClose={handleCloseChat}
        />
      </Dialog>
    </div>
  );
}

export default React.memo(Dashboard);
