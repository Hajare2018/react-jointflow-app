import HttpClient from './HttpClient';

export function getUserAccess(data) {
  return HttpClient.fetchAccessGroup(data);
}

export function postUserAccess(data) {
  return HttpClient.postAccessGroup(data);
}

export function singleGroupAccess(data) {
  return HttpClient.fetchSingleAccessGroup(data);
}

export function saveGroupAccess(data) {
  return HttpClient.postGroupAccess(data);
}

export function editGroupAccess(data) {
  return HttpClient.putGroupAccess(data);
}

export function removeUserAccess(data) {
  return HttpClient.removeAccessGroup(data);
}

export function getPermissions(data) {
  return HttpClient.fetchPermissions(data);
}

export function getAccessPermissions(data) {
  return HttpClient.fetchAccessPermissions(data);
}

export function saveGroupPermissions(data) {
  return HttpClient.postGroupPermissions(data);
}

export function deleteGroupPermissions(data) {
  return HttpClient.removeGroupPermissions(data);
}

export function getForecast(data) {
  return HttpClient.fetchForecast(data);
}

export function getUserHeirarchy(data) {
  return HttpClient.fetchUserHierarchy(data);
}

export function getOrgHeirarchy(data) {
  return HttpClient.fetchOrgHierarchy(data);
}

export function maapAccess(data) {
  return HttpClient.giveMaapAccess(data);
}

export function groupView(data) {
  return HttpClient.fetchGroupView(data);
}

export function reassignUser(data) {
  return HttpClient.assignUser(data);
}
