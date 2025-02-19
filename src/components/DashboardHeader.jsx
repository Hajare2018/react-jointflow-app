import {
  Avatar,
  AvatarGroup,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import React, { useState } from 'react';
import {
  FaFolderOpen,
  FaSlackHash,
  FaHubspot,
  FaSalesforce,
  FaLink,
  FaRegEdit,
} from 'react-icons/fa';
import SlackIcon from '../assets/icons/slack_icon.png';
import {
  createImageFromInitials,
  dateFormat,
  formatDateTime,
  getForecastInfo,
  getForecastStatus,
} from './Utils';
import CompanyDetails from './Companies/CompanyDetails';
import {
  Add,
  CheckCircleOutlined,
  Edit,
  EqualizerOutlined,
  QuestionAnswerOutlined,
  WarningRounded,
} from '@mui/icons-material';
import TeamMembers from './TeamMembers';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../Redux/Actions/user-info';
import { show } from '../Redux/Actions/loader';
import { requestCompanyData } from '../Redux/Actions/companies';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import MeddpiccStatus from './MeddpiccStatus';
import GaugeChart from './ChartComponent/GaugeChart';
import MaapPreview from './MaapPreview';
import HttpClient from '../Api/HttpClient';
import 'react-loading-skeleton/dist/skeleton.css';
import AssigneeModal from './AssigneeModal';
import { useTenantContext } from '../context/TenantContext';

const useStyles = makeStyles(() => ({
  fab: {
    backgroundColor: 'rgba(98,125, 175, 1.7)',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: 'rgba(98,125, 175, 1.7)',
    },
  },
  allFabs: {
    margin: 12,
    top: '34%',
    transform: 'translateY(-50%)',
    right: 50,
    zIndex: 9,
    position: 'absolute',
  },
  avatar: {
    '&:hover': {
      transform: 'scale(1.75)',
    },
  },
}));

const LightTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: '#6D6D6D',
    color: '#ffffff',
    fontSize: 11,
    width: '20vw',
  },
}))(Tooltip);

const StyledTooltip = withStyles(() => ({
  tooltip: {
    maxWidth: 'none',
  },
}))(Tooltip);

function DashboardHeader({
  board,
  projectData,
  slackIntegrated,
  connectedCrm,
  tenantCrm,
  handleRightView,
}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [showCompany, setShowCompany] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorExt, setAnchorExt] = React.useState(null);
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const projectWithHeader = useSelector((state) => state.singleProjectWithHeader);
  const thisProject = projectWithHeader?.data?.length > 0 ? projectWithHeader?.data?.[0] : [];
  const { meddpicc_enabled: isMeddpiccEnabled } = useTenantContext();

  const handleMaapPreview = () => {
    setShowPreview(!showPreview);
  };

  const handleShowCompany = () => {
    dispatch(requestCompanyData({ id: projectData?.buyer_company_details?.id }));
    dispatch(
      getAllUsers({
        company_id: projectData?.buyer_company_details?.id,
        usersByCompany: true,
      }),
    );
    setShowCompany(!showCompany);
  };
  const showTeamMembers = () => {
    setOpen(true);
    dispatch(show(true));
    dispatch(
      getAllUsers({
        company_id: projectData?.buyer_company_details?.id,
        usersByCompany: true,
      }),
    );
  };
  const closeTeamMembers = () => {
    setOpen(false);
  };

  const clientVisibleCards = projectData?.cards?.filter((card) => card.client_visible == true);
  const handleShowteam = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleShowExt = (event) => {
    setAnchorExt(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseExt = () => {
    setAnchorExt(null);
  };

  const showTeam = Boolean(anchorEl);
  const showExt = Boolean(anchorExt);

  const id = showTeam ? 'simple-popover' : undefined;
  const ext_id = showExt ? 'simple-popover' : undefined;

  let cardsArray = [
    {
      id: 0,
      content: (
        <div>
          <strong>{thisProject?.name}</strong>
          <h4
            style={{
              color: '#627daf',
              cursor: 'pointer',
              fontWeight: '700',
            }}
            onClick={handleShowCompany}
          >
            <u>{thisProject?.buyer_company_details?.name}</u>
          </h4>
        </div>
      ),
      left_border: 'analytics-card__one',
      icon: (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => {
            handleRightView({
              form: true,
              insight: false,
              contents: false,
              showExtra: true,
              ganttView: false,
              createSlackChannel: false,
              slackChat: false,
              timeline: false,
              crm: false,
              show_meddpicc: false,
            });
          }}
        >
          {thisProject?.closed ? (
            <StyledTooltip title="Open Board">
              <FaFolderOpen className="app-color" />
            </StyledTooltip>
          ) : (
            <StyledTooltip title="Edit Board">
              <Edit className="app-color" />
            </StyledTooltip>
          )}
        </div>
      ),
    },
    {
      id: 1,
      content: (
        <div>
          <strong>Tasks</strong>
          <p>{thisProject?.total_cards}</p>
        </div>
      ),
      left_border: 'analytics-card__two',
      centre_content: (
        <StyledTooltip title={thisProject?.percentage_completed + '% completed'}>
          <div style={{ height: 50, width: 50 }}>
            <CircularProgressbarWithChildren
              key={thisProject?.percentage_completed}
              styles={{
                path: {
                  stroke: 'green',
                },
              }}
              strokeWidth={10}
              value={thisProject?.percentage_completed}
            >
              {<div className="text-centre">{thisProject?.percentage_completed + '%'}</div>}
            </CircularProgressbarWithChildren>
          </div>
        </StyledTooltip>
      ),
      icon: (
        <StyledTooltip
          title={'Display Gantt Chart'}
          open={showTooltip}
          disableHoverListener
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="cursor-pointer">
            <button
              onClick={() => {
                setShowTooltip(false);
                handleRightView({
                  form: false,
                  insight: false,
                  contents: false,
                  showExtra: true,
                  ganttView: true,
                  createSlackChannel: false,
                  slackChat: false,
                  timeline: false,
                  crm: false,
                  show_meddpicc: false,
                });
              }}
            >
              <EqualizerOutlined
                className="app-color h-7 w-7"
                style={{ transform: 'rotate(90deg)' }}
              />
            </button>
          </div>
        </StyledTooltip>
      ),
    },
    {
      id: 2,
      content: (
        <div className="d-flex-column">
          <p>
            Target:{' '}
            <span>
              <StyledTooltip
                title={formatDateTime(new Date(thisProject?.target_close_date), 'ddd d MMM yyyy')}
                placement="top"
              >
                <Chip
                  size="small"
                  label={<strong>{dateFormat(new Date(thisProject?.target_close_date))}</strong>}
                  variant="default"
                />
              </StyledTooltip>
            </span>
          </p>
          <p>
            Predicted:{' '}
            <span>
              <StyledTooltip
                title={
                  thisProject?.board_likely_end_date === 'NA'
                    ? ''
                    : formatDateTime(new Date(thisProject?.board_likely_end_date), 'ddd d MMM yyyy')
                }
                placement="top"
              >
                <Chip
                  size="small"
                  label={
                    <strong>
                      {dateFormat(new Date(thisProject?.board_likely_end_date)) === 'NaNth'
                        ? 'NA'
                        : dateFormat(new Date(thisProject?.board_likely_end_date))}
                    </strong>
                  }
                  variant="default"
                />
              </StyledTooltip>
            </span>
          </p>
          <p>
            Value:{' '}
            <span>
              <strong>{thisProject?.project_value}</strong>
            </span>
          </p>
        </div>
      ),
      left_border: 'analytics-card__three',
      icon: (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => {
            handleRightView({
              form: false,
              insight: true,
              contents: false,
              showExtra: true,
              ganttView: false,
              createSlackChannel: false,
              slackChat: false,
              timeline: false,
              crm: false,
              show_meddpicc: false,
            });
          }}
        >
          <div className="d-flex-column justify-centre">
            {new Date(thisProject?.board_likely_end_date).getTime() <=
            new Date(thisProject?.target_close_date).getTime() ? (
              <CheckCircleOutlined
                style={{
                  color: '#3edab7',
                  height: 35,
                  width: 35,
                }}
              />
            ) : (
              <div>
                <StyledTooltip
                  title={
                    new Date(thisProject?.board_likely_end_date).getTime() >
                    new Date(thisProject.target_quarter_end_date).getTime()
                      ? 'Predicted date greater than target and after end of quarter'
                      : new Date(thisProject?.board_likely_end_date).getTime() >
                          new Date(thisProject.target_close_date).getTime()
                        ? 'Predicted date greater than the target date'
                        : ''
                  }
                  placement="top"
                  arrow
                >
                  <WarningRounded
                    style={{
                      color:
                        new Date(thisProject?.board_likely_end_date).getTime() >
                        new Date(thisProject.target_quarter_end_date).getTime()
                          ? 'lightcoral'
                          : new Date(thisProject?.board_likely_end_date).getTime() >
                              new Date(thisProject.target_close_date).getTime()
                            ? '#ec7d31'
                            : '',
                      height: 35,
                      width: 35,
                    }}
                  />
                </StyledTooltip>
              </div>
            )}
            <LightTooltip
              title={
                <div
                  style={{ padding: 5 }}
                  dangerouslySetInnerHTML={{
                    __html: getForecastInfo(thisProject?.forecast_status, {
                      target_quarter_end_date: thisProject?.target_quarter_end_date,
                      board_likely_end_date: thisProject?.board_likely_end_date,
                      likely_end_date_rush: thisProject?.likely_end_date_rush,
                    }),
                  }}
                />
              }
            >
              <Chip
                size="small"
                label={thisProject?.forecast_status}
                variant="default"
                style={{
                  backgroundColor: getForecastStatus(thisProject?.forecast_status),
                  cursor: 'pointer',
                  color: '#ffffff',
                  fontWeight: '700',
                }}
              />
            </LightTooltip>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      content: (
        <Grid
          item
          xs={6}
          sm={12}
          md={1}
          className="TeamAvatarWrap"
          style={{ whiteSpace: 'nowrap' }}
        >
          <strong>Internal Team</strong>
          {thisProject?.int_assignee_team == null ? (
            'Team'
          ) : (
            <>
              <AvatarGroup onClick={handleShowteam}>
                {thisProject?.int_assignee_team?.map((img) => (
                  // TODO fixme
                  // eslint-disable-next-line react/jsx-key
                  <StyledTooltip title={img?.first_name + ' ' + img?.last_name}>
                    <Avatar
                      className={classes.avatar}
                      style={{ height: 25, width: 25 }}
                    >
                      <img
                        src={
                          img?.avatar === null
                            ? createImageFromInitials(
                                200,
                                img?.first_name + ' ' + img?.last_name,
                                '#627daf',
                              )
                            : img?.avatar
                        }
                        className="img-lazy-avatar"
                        loading="lazy"
                        alt={<CircularProgress />}
                      />
                    </Avatar>
                  </StyledTooltip>
                ))}
              </AvatarGroup>
              <AssigneeModal
                id={id}
                show={showTeam}
                anchor={anchorEl}
                handleClose={handleClose}
                assignee_team={thisProject?.int_assignee_team}
              />
              {thisProject?.int_assignee_team?.length === 0 && <div className="h-7" />}
            </>
          )}
        </Grid>
      ),
      left_border: 'analytics-card__four',
      icon: (
        <div className="d-flex justify-space-between">
          <StyledTooltip title="Slack conversation">
            <div
              className="cursor-pointer mr-2"
              onClick={() =>
                handleRightView({
                  form: false,
                  insight: false,
                  contents: false,
                  showExtra: true,
                  ganttView: false,
                  createSlackChannel:
                    connectedCrm !== '' &&
                    thisProject?.board_message_count === 0 &&
                    thisProject?.slack_channel_id === null
                      ? true
                      : false,
                  slackChat: thisProject?.slack_channel_id !== null ? true : false,
                  timeline: false,
                  crm: false,
                  show_meddpicc: false,
                })
              }
            >
              {slackIntegrated &&
                (thisProject?.slack_channel_id !== null ? (
                  <img
                    src={SlackIcon}
                    style={{ width: 20, height: 20 }}
                  />
                ) : connectedCrm !== '' &&
                  projectData?.board_message_count === 0 &&
                  thisProject?.slack_channel_id === null ? (
                  <FaSlackHash className="app-color" />
                ) : (
                  ''
                ))}
            </div>
          </StyledTooltip>
          <StyledTooltip title="Push to CRM">
            <div
              className="cursor-pointer mr-2"
              onClick={() =>
                handleRightView({
                  form: false,
                  insight: false,
                  contents: false,
                  showExtra: true,
                  ganttView: false,
                  createSlackChannel: false,
                  slackChat: false,
                  timeline: false,
                  crm: true,
                  show_meddpicc: false,
                })
              }
            >
              {thisProject?.crm_id !== null &&
                (tenantCrm === 'hubspot' ? (
                  <FaHubspot style={{ color: '#fa7820' }} />
                ) : tenantCrm === 'salesforce' ? (
                  <FaSalesforce style={{ color: '#1798c1' }} />
                ) : (
                  ''
                ))}
            </div>
          </StyledTooltip>
          <StyledTooltip title="Keep conversation here">
            <div
              className="cursor-pointer"
              onClick={() =>
                handleRightView({
                  form: false,
                  insight: false,
                  contents: false,
                  showExtra: true,
                  ganttView: false,
                  createSlackChannel: false,
                  slackChat: false,
                  timeline: true,
                  crm: false,
                  show_meddpicc: false,
                })
              }
            >
              {thisProject?.slack_channel_id === null && projectData?.board_message_count > 0 ? (
                <QuestionAnswerOutlined style={{ color: '#3edab7' }} />
              ) : thisProject?.slack_channel_id === null &&
                projectData?.board_message_count === 0 ? (
                <QuestionAnswerOutlined />
              ) : (
                ''
              )}
            </div>
          </StyledTooltip>
        </div>
      ),
    },
    {
      id: 4,
      content: (
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          className="TeamAvatarWrap"
        >
          <strong>Mutual Action Plan</strong>
          {thisProject?.ext_assignee_team === null ? (
            'Team'
          ) : (
            <div className="d-flex">
              <AvatarGroup onClick={handleShowExt}>
                {thisProject?.ext_assignee_team?.map((img) => (
                  // TODO fixme
                  // eslint-disable-next-line react/jsx-key
                  <StyledTooltip
                    title={
                      <div className="d-flex-column justify-centre">
                        <Avatar
                          className={classes.avatar}
                          src={
                            (img?.avatar === null || img?.avatar?.split('/')?.[4] == 'undefined') &&
                            img?.first_name !== 'undefined'
                              ? createImageFromInitials(
                                  200,
                                  img?.first_name + ' ' + img?.last_name,
                                  '#6385b7',
                                )
                              : img?.first_name == 'undefined'
                                ? ''
                                : img?.avatar
                          }
                          style={{ height: 150, width: 150, marginBottom: 10 }}
                        />
                        <div className="p-1">
                          <h4>
                            <strong>Name:</strong> {img?.first_name + img?.last_name}
                          </h4>
                          <h4>
                            <strong>Email:</strong> {img?.email}
                          </h4>
                          <h4>
                            <strong>Phone:</strong>
                            {img?.phone_number === 'false' ||
                            img?.phone_number === '' ||
                            img?.phone_number == 'undefined'
                              ? 'Unknown'
                              : img?.phone_number}
                          </h4>
                        </div>
                      </div>
                    }
                    placement="bottom"
                    arrow
                  >
                    <Avatar
                      className={classes.avatar}
                      src={
                        img?.avatar === null
                          ? createImageFromInitials(
                              200,
                              img?.first_name + ' ' + img?.last_name,
                              '#627daf',
                            )
                          : img?.avatar
                      }
                      style={{ height: 25, width: 25 }}
                    />
                  </StyledTooltip>
                ))}
              </AvatarGroup>
              <AssigneeModal
                id={ext_id}
                show={showExt}
                anchor={anchorExt}
                handleClose={handleCloseExt}
                assignee_team={thisProject?.ext_assignee_team}
              />
              <Avatar
                className={classes.avatar}
                style={{ height: 30, width: 30 }}
              >
                <StyledTooltip
                  title="Add a member"
                  placement="right"
                >
                  <IconButton onClick={showTeamMembers}>
                    <Add className="app-color" />
                  </IconButton>
                </StyledTooltip>
              </Avatar>
            </div>
          )}
        </Grid>
      ),
      left_border: 'analytics-card__five',
      icon: (
        <div className="d-flex justify-centre">
          <StyledTooltip title="Preview MAAP">
            <div
              onClick={handleMaapPreview}
              style={{ cursor: 'pointer', paddingBottom: 10 }}
            >
              <FaLink className="app-color ml-2" />
            </div>
          </StyledTooltip>
          <StyledTooltip title="Contents">
            <div
              style={{ cursor: 'pointer', paddingBottom: 10 }}
              onClick={() => {
                handleRightView({
                  form: false,
                  insight: false,
                  contents: true,
                  showExtra: true,
                  ganttView: false,
                  createSlackChannel: false,
                  slackChat: false,
                  timeline: false,
                  crm: false,
                  show_meddpicc: false,
                });
              }}
            >
              <FaRegEdit className="app-color ml-2" />
            </div>
          </StyledTooltip>
        </div>
      ),
    },
    {
      id: 5,
      content: (
        <div>
          <GaugeChart score={thisProject?.meddpicc_scores} />
        </div>
      ),
      centre_content: (
        <div
          onClick={() => {
            handleRightView({
              form: false,
              insight: false,
              contents: false,
              showExtra: true,
              ganttView: false,
              createSlackChannel: false,
              slackChat: false,
              timeline: false,
              crm: false,
              show_meddpicc: true,
            });
          }}
        >
          <MeddpiccStatus score={thisProject?.meddpicc_scores} />
        </div>
      ),
      left_border: 'analytics-card__six',
      icon: <div />,
    },
  ];
  const allCards = cardsArray?.slice(0, -1);

  return (
    <>
      <div
        id="analytics-card"
        className="analytics-card-container p-0"
      >
        {(isMeddpiccEnabled ? cardsArray : allCards)?.map((card) => (
          // TODO fixme
          // eslint-disable-next-line react/jsx-key
          <div className={`analytics-card ${card.left_border} p-2`}>
            <div className="analytics-card__content ml-2">{card.content}</div>
            {'centre_content' in card && (
              <div className="analytics-card__content">{card.centre_content}</div>
            )}
            <div className="analytics-card__icon">{card.icon}</div>
          </div>
        ))}
      </div>
      <CompanyDetails
        open={showCompany}
        data={{
          disabled: true,
          id: thisProject?.buyer_company_details?.id,
          icon: thisProject?.buyer_company_details?.company_image,
        }}
        handleClose={handleShowCompany}
      />
      <TeamMembers
        open={open}
        handleClose={closeTeamMembers}
        board={board}
        company_id={thisProject?.buyer_company_details?.id}
      />
      <MaapPreview
        open={showPreview}
        handleClose={handleMaapPreview}
        url={`${window.location.origin}/mutual-action-plan/?task_id=${
          clientVisibleCards?.length > 0 ? clientVisibleCards?.[0]?.id : 0
        }&board=${thisProject?.id}&jt=${HttpClient.api_token()}`}
      />
    </>
  );
}

export default React.memo(DashboardHeader);
