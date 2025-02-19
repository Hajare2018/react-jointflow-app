import HttpClient from './HttpClient';

export function getSlackHistory(data) {
  return HttpClient.fetchSlackHistory(data);
}

export function getBoardMembers(data) {
  return HttpClient.fetchBoardMembers(data);
}

export function createSlackMessage(data) {
  return HttpClient.postSlackMessage(data);
}

export function createSlackChannel(data) {
  return HttpClient.newSlackChannel(data);
}

export function inviteSlackUser(data) {
  return HttpClient.slackChannelInvitation(data);
}

export function inviteUserToWorkspace(data) {
  return HttpClient.slackWorkspaceInvitation(data);
}
