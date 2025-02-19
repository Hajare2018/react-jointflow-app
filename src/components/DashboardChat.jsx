import { AppBar, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { PersonAddRounded, QuestionAnswerOutlined } from '@mui/icons-material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Comments from './CommentWindow/Comments';
import SlackIcon from '../assets/icons/slack_icon.png';
import SlackUsers from './SlackStuffs/SlackUsers';
import { requestBoardMembers } from '../Redux/Actions/slack-stuffs';

const useStyles = makeStyles(() => ({
  appBar: {
    position: 'sticky',
    backgroundColor: '#eef2f6',
    color: '#222222',
    height: 55,
    borderRadius: '0.4rem  0.4rem  0 0',
  },
}));

function DashboardChat({ forSlack, forTimeline }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const singleBoard = useSelector((state) => state.singleProjectData);
  const slackComments = useSelector((state) => state.slackHistoryData);
  const slack_messages = slackComments?.data;
  const singleBoardData = singleBoard?.data?.length > 0 ? singleBoard?.data?.[0] : [];
  const showSlackUsers = () => {
    dispatch(
      requestBoardMembers({
        slack_channel_id: singleBoardData?.slack_channel_id,
        board_id: singleBoardData?.id,
      }),
    );
    setShow(true);
  };
  const hideSlackUsers = () => {
    setShow(false);
  };
  return (
    <div
      style={{
        border: '2px solid #aeaeae',
        borderRadius: '0.4rem',
      }}
    >
      <AppBar className={classes.appBar}>
        <div
          className={`d-flex justify-space-between m-3 ${forSlack ? 'slack-color' : 'app-color'}`}
        >
          <div className="d-flex">
            {forTimeline ? (
              <QuestionAnswerOutlined style={{ width: 30, height: 30, marginRight: 5 }} />
            ) : forSlack ? (
              <img
                src={SlackIcon}
                style={{ width: 30, height: 30, marginRight: 5 }}
              />
            ) : (
              ''
            )}
            {singleBoardData?.name == undefined && slack_messages?.channel_name == undefined ? (
              <strong>Loading...</strong>
            ) : (
              <strong>
                {forTimeline
                  ? `Deal Room # ${singleBoardData?.name}`
                  : forSlack
                    ? `Channel: # ${slack_messages?.channel_name}`
                    : ''}
              </strong>
            )}
          </div>
          {forSlack && (
            <Tooltip
              title="Invite A Slack User"
              placement="left"
            >
              <div
                onClick={showSlackUsers}
                style={{ cursor: 'pointer' }}
              >
                <PersonAddRounded style={{ width: 30, height: 30 }} />
              </div>
            </Tooltip>
          )}
        </div>
      </AppBar>
      <Comments
        taskData={{ board_id: singleBoardData?.id }}
        channel={singleBoardData?.slack_channel_id}
        forBoards={forTimeline}
        forSlack={forSlack}
      />
      <SlackUsers
        open={show}
        handleClose={hideSlackUsers}
        slack_channel_id={singleBoardData?.slack_channel_id}
        board={singleBoardData?.id}
        slack_channel_name={slack_messages?.channel_name}
      />
    </div>
  );
}

export default React.memo(DashboardChat);
