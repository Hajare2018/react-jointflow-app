import { createAction } from 'redux-actions';
import * as Slack from '../../Api/slack-stuffs';
import { handleError } from '../../components/Utils';
import {
  CREATE_SLACK_CHANNEL,
  CREATE_SLACK_MESSAGE,
  FETCH_BOARD_MEMBERS,
  FETCH_SLACK_HISTORY,
  INVITE_SLACK_USERS,
  INVITE_TO_SLACK_WORKSPACE,
} from '../Constants/actionTypes';
import {
  boardMembersData,
  newSlackChannelData,
  postedSlackMessage,
  slackHistoryData,
  slackInviteData,
  workspaceInviteData,
} from '../Reducers/slack-stuffs';
import requestSingleProject from './single-project';
import { showSuccessSnackbar } from './snackbar';

const slack_history = createAction(FETCH_SLACK_HISTORY);
const board_members = createAction(FETCH_BOARD_MEMBERS);
const new_slack_channel = createAction(CREATE_SLACK_CHANNEL);
const new_slack_message = createAction(CREATE_SLACK_MESSAGE);
const invite_slack_user = createAction(INVITE_SLACK_USERS);
const invite_user_to_workspace = createAction(INVITE_TO_SLACK_WORKSPACE);

export function requestSlackHistory(params) {
  return (dispatch) =>
    Slack.getSlackHistory(params)
      .then((data) => {
        dispatch(slack_history(data));
        dispatch(slackHistoryData({ data: data.data, errors: null }, FETCH_SLACK_HISTORY));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestBoardMembers(params) {
  return (dispatch) =>
    Slack.getBoardMembers(params)
      .then((data) => {
        dispatch(board_members(data));
        dispatch(boardMembersData({ data: data.data, errors: null }, FETCH_BOARD_MEMBERS));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestNewSlackChannel(params) {
  return (dispatch) =>
    Slack.createSlackChannel(params)
      .then((data) => {
        dispatch(requestSingleProject({ id: params?.data?.board_id }));
        dispatch(showSuccessSnackbar(data?.data?.details));
        dispatch(new_slack_channel(data));
        dispatch(newSlackChannelData({ data: data.data, errors: null }, CREATE_SLACK_CHANNEL));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function saveSlackMessage(params) {
  return (dispatch) =>
    Slack.createSlackMessage(params)
      .then((data) => {
        dispatch(requestSlackHistory({ slack_channel_id: params.slack_channel_id }));
        dispatch(showSuccessSnackbar(data?.data?.details));
        dispatch(new_slack_message(data));
        dispatch(postedSlackMessage({ data: data.data, errors: null }, CREATE_SLACK_MESSAGE));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function slackUserInvite(params) {
  return (dispatch) =>
    Slack.inviteSlackUser(params)
      .then((data) => {
        dispatch(
          requestBoardMembers({
            slack_channel_id: params?.slack_channel_id,
            board_id: params?.board_id,
          }),
        );
        dispatch(invite_slack_user(data));
        dispatch(slackInviteData({ data: data.data, errors: null }, INVITE_SLACK_USERS));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function inviteToJoinWorkspace(params) {
  return (dispatch) =>
    Slack.inviteUserToWorkspace(params)
      .then((data) => {
        dispatch(
          requestBoardMembers({
            slack_channel_id: params?.slack_channel_id,
            board_id: params?.board_id,
          }),
        );
        dispatch(invite_user_to_workspace(data));
        dispatch(workspaceInviteData({ data: data.data, errors: null }, INVITE_TO_SLACK_WORKSPACE));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}
