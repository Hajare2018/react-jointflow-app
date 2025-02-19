import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardEndSection from '../components/DashboardEndSection';
import DashboardHeader from '../components/DashboardHeader';
import DashboardTable from '../components/DashboardTable';
import { Grid, Paper, Tooltip } from '@mui/material';
import requestSingleProject from '../Redux/Actions/single-project';
import AddProjectForm from '../components/AddProjectForm';
import { currencyFormatter, dateFormat } from '../components/Utils';
import { getUser } from '../Redux/Actions/user-info';
import { fetchProjectsInsight, requestContentsList } from '../Redux/Actions/dashboard-data';
import CongratulationsModal from '../components/CongratulationsModal';
import { updateProject } from '../Redux/Actions/create-project';
import { show } from '../Redux/Actions/loader';
import { ArrowBackIosOutlined, VerticalSplitOutlined } from '@mui/icons-material';
import { requestSlackHistory } from '../Redux/Actions/slack-stuffs';
import CreateSlackChannel from '../components/SlackStuffs/CreateSlackChannel';
import { requestBoardComments } from '../Redux/Actions/comments';
import HttpClient from '../Api/HttpClient';
import { requestCrmSync } from '../Redux/Actions/crm-data';
import DashboardApexChart from '../components/ChartComponent/DashboardApexChart';
import DashboardChat from '../components/DashboardChat';
import Loader from '../components/Loader';
import MeddpiccView from '../components/MeddpiccView';
import AppButton from '../components/ProjectForm/Components/AppButton';
import { useNavigate } from 'react-router-dom';
import { useTenantContext } from '../context/TenantContext';
import { useUserContext } from '../context/UserContext';

function Board() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [boardId, setBoardId] = useState(0);
  const [formData, setFormData] = useState({});
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
  // TODO FIXME setLeftView never used so it should not live in state
  // eslint-disable-next-line no-unused-vars
  const [leftViews, setLeftViews] = useState({
    taskTable: true,
  });
  const { user } = useUserContext();
  const loader = useSelector((state) => state.showLoader);
  const projectData = useSelector((state) => state?.singleProjectData);
  const connectedCrm = useSelector((state) => state.crmConnectedData);

  const path = new URL(window.location.href);
  const isActions = new URLSearchParams(path.search).get('actions');
  const isNavbars = new URLSearchParams(path.search).get('navbars');
  const isNavback = new URLSearchParams(path.search).get('navback');
  const board_id = new URLSearchParams(path.search).get('id');

  useEffect(() => {
    setTimeout(() => {
      dispatch(
        getUser({
          fetchPermissions: true,
          isLightUser: false,
          fetchSingleUser: true,
        }),
      );
    }, 3000);
    window.pendo.initialize({
      visitor: {
        id: user?.id,
        email: user?.email,
        full_name: user?.first_name + ' ' + user?.last_name,
        role: user?.role,
        page: 'Single Board',
      },
      account: { id: HttpClient.tenant() },
    });
    setBoardId(board_id);
    dispatch(requestSingleProject({ id: board_id, header: true }));
    dispatch(requestSingleProject({ id: board_id }));
    dispatch(fetchProjectsInsight({ board_id: board_id }));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (
        projectData?.data?.[0]?.cards?.length &&
        allEqual(projectData?.data?.[0]?.cards) == true
      ) {
        if (projectData?.data?.[0]?.closed) {
          setComplete(false);
        } else {
          setComplete(true);
        }
      }
    }, 2000);
  }, [projectData]);

  const handleComplete = () => {
    setComplete(!complete);
  };

  const handleCloseChat = () => {
    setOpenChat({
      createSlackChannel: false,
    });
  };

  const { tenant_locale, currency_symbol, company_name, crm_system, slack_integrated } =
    useTenantContext();
  const allData = projectData?.data?.length > 0 ? projectData?.data : [];

  const allEqual = (arr) => {
    if (arr.length > 0) {
      return (arr || [])?.every((val) => val.is_completed == true);
    } else {
      return false;
    }
  };

  const markCompleted = () => {
    setTimeout(() => {
      doComplete(true);
    }, 1000);
  };

  const doComplete = (complete) => {
    dispatch(show(true));
    const projectRequest = {
      closed: complete ? 'True' : 'False',
    };
    dispatch(
      updateProject({
        id: boardId,
        data: projectRequest,
        filterByTemplate: false,
        showSuccess: true,
      }),
    );
    if (!loader.show) {
      setComplete(false);
    }
  };

  const allTasks = allData?.length > 0 ? allData : [];
  const tableData = [];
  const chartData = [];
  const commentData = [];
  let projectName = '';
  let projectValue = 0;
  let companyName = '';
  let companyIcon = '';
  let closedDate = '';
  let completion_percent = '';
  let predicted_date = '';
  // TODO REVIEW
  // eslint-disable-next-line no-unused-vars
  let alert_flag = '';
  // eslint-disable-next-line no-unused-vars
  let red_flag = '';
  // eslint-disable-next-line no-unused-vars
  let green_flag = '';
  let external_assignee = [];
  let internal_assignee = [];
  let companyData = {};

  allTasks.forEach((element) => {
    projectName = element?.name;
    projectValue = element?.project_value;
    companyName = element?.buyer_company_details?.name;
    companyData = element?.buyer_company_details;
    companyIcon = element?.buyer_company_details?.company_image;
    closedDate = element?.target_close_date;
    alert_flag = element?.nb_amber_flags;
    red_flag = element?.nb_red_flags;
    green_flag = element?.nb_green_flags;
    external_assignee = element?.ext_assignee_team;
    internal_assignee = element?.int_assignee_team;
    completion_percent = element?.percentage_completed;
    predicted_date = element?.board_likely_end_date == null ? 'NA' : element?.board_likely_end_date;
    element.cards.forEach((element) => {
      tableData.push({
        task_name: element?.title,
        start_date: element?.start_date,
        end_date: element?.end_date,
        display_end_date: element?.display_end_date,
        attachment_count: element?.document_count,
        client_visible: element?.client_visible,
        assignee_pic: element?.internal_assignee_details?.avatar,
        internal_assignee: element?.internal_assignee_details,
        external_assignee: element?.external_assignee_details,
        deal_police: element?.external_assignee_deal_police?.deal_police?.[0],
        last_completion_time: element?.task_type_details?.last_completion_time,
        avg_completion_time: element?.task_type_details?.last5_avg_completion_time,
        task_status: element?.is_completed,
        edit: true,
        task_id: element?.id,
        board_id: boardId,
        task_type_name: element?.task_type_details?.custom_label,
        task_type: element?.task_type_details?.id,
        attachments: element?.last_uploaded_document,
        description: element?.description,
        comments: element?.comments,
        buyer_company: element?.buyer_company_details,
        taskColor: element?.task_type_details?.color,
        owner: element?.owner_details,
        target_close_date: element?.target_close_date,
        steps: element?.steps_count,
        todo_steps: element?.todo_steps_count,
        done_steps: element?.done_steps_count,
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
        board_id: board_id,
        name: allTasks?.[0]?.name,
        value: allTasks?.[0]?.project_value,
        description: allTasks?.[0]?.description,
        company_name: allTasks?.[0]?.buyer_company_details?.name,
        company_id: allTasks?.[0]?.buyer_company_details?.id,
        target_close_date: allTasks?.[0].target_close_date,
        green_flag: allTasks?.[0]?.nb_green_flags,
        red_flag: allTasks?.[0]?.nb_red_flags,
        amber_flag: allTasks?.[0]?.nb_amber_flags,
        edit_project: true,
        archived: allTasks?.[0]?.archived,
        crm_id: allTasks?.[0]?.crm_id,
      });
    } else if (e.contents) {
      dispatch(requestContentsList({ id: board_id, fetchContent: false }));
      setFormData({ edit_project: true });
    } else if (e.slackChat) {
      dispatch(
        requestSlackHistory({
          slack_channel_id: projectData?.data?.[0]?.slack_channel_id,
        }),
      );
    } else if (e.timeline) {
      dispatch(
        requestBoardComments({
          board_id: board_id,
        }),
      );
    } else if (e.crm) {
      dispatch(
        requestCrmSync({
          data: {
            crm: crm_system,
            board_id: board_id,
          },
        }),
      );
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <main
        id="page"
        className={isNavbars == 'True' || isNavbars == null ? 'panel-view' : ''}
      >
        <div className="overview">
          {isNavback == 'True' && (
            <div className="mt-3 ml-3">
              <AppButton
                outlined
                onClick={goBack}
                className="external-assign"
                buttonText={
                  <span>
                    <ArrowBackIosOutlined />
                    <strong>Back to List</strong>
                  </span>
                }
              />
            </div>
          )}
          <div>
            {allData?.length > 0 ? (
              <>
                {(isActions == 'True' || isActions == null) && (
                  <div
                    className="sticky"
                    style={{
                      position: 'sticky',
                      top: 0,
                      zIndex: 4,
                      backgroundColor: '#ffffff',
                      width: '100%',
                    }}
                  >
                    <DashboardHeader
                      projectTitle={projectName}
                      company={companyName}
                      projectValue={
                        projectValue === null
                          ? '0'
                          : currencyFormatter(tenant_locale, projectValue, currency_symbol)
                      }
                      icon={companyIcon}
                      company_data={companyData}
                      closingDate={closedDate}
                      user_company={company_name}
                      internal={internal_assignee}
                      external={external_assignee}
                      completion={completion_percent}
                      predicted={predicted_date}
                      predictedWithFormat={dateFormat(new Date(predicted_date))}
                      board={board_id}
                      tasksCount={projectData?.data?.[0]?.cards?.length}
                      isProjectClosed={projectData?.data?.[0]?.closed}
                      projectData={projectData?.data?.[0]}
                      slackIntegrated={slack_integrated}
                      connectedCrm={connectedCrm?.data?.details}
                      tenantCrm={crm_system}
                      handleRightView={handleRightViews}
                      view={{
                        gantt: openChat.ganttChart,
                        table: showFulltable && showExtra,
                      }}
                      isTableView={leftViews?.taskTable}
                    />
                  </div>
                )}
                <div style={{ height: 12 }} />
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
                      style={{ position: 'relative' }}
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
                        <div className="pr-3">
                          <DashboardTable
                            tableData={tableData}
                            chartData={chartData}
                            project_data={allData}
                            board={board_id}
                            showExtra={showFulltable}
                          />
                          <Tooltip
                            title={showExtra ? 'Collapse this view' : 'Expand this view'}
                            open={showTooltip}
                            disableHoverListener
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                          >
                            <div
                              style={{
                                backgroundColor: '#aeaeae',
                                color: '#ffffff',
                                cursor: 'pointer',
                                float: 'right',
                                position: 'absolute',
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
                        </div>
                      </div>
                    </Grid>
                    {!showExtra && (
                      <Grid
                        className={`overflowBox ${!openChat.ganttChart && 'pl-4'}`}
                        item
                        xs={12}
                        sm={12}
                        md={showExtra ? 0 : 5}
                      >
                        {openChat.ganttChart ? (
                          <div
                            style={{
                              marginTop: 27,
                              height: 'calc(100% - 5vh)',
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
                              height: 'calc(100% - 5vh)',
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
              </>
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </main>
      <CongratulationsModal
        open={complete}
        handleClose={handleComplete}
        isCompleted={markCompleted}
      />
      <CreateSlackChannel
        open={openChat.createSlackChannel}
        handleClose={handleCloseChat}
      />
    </>
  );
}

export default React.memo(Board);
