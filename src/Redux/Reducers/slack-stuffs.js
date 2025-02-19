import {
  CREATE_SLACK_CHANNEL,
  CREATE_SLACK_MESSAGE,
  FETCH_BOARD_MEMBERS,
  FETCH_SLACK_HISTORY,
  INVITE_SLACK_USERS,
  INVITE_TO_SLACK_WORKSPACE,
} from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export function slackHistoryData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_SLACK_HISTORY:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function boardMembersData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_BOARD_MEMBERS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function postedSlackMessage(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_SLACK_MESSAGE:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function newSlackChannelData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_SLACK_CHANNEL:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function slackInviteData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case INVITE_SLACK_USERS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function workspaceInviteData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case INVITE_TO_SLACK_WORKSPACE:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
