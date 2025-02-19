import HttpClient from './HttpClient';

export function createProject(data) {
  return HttpClient.saveProject(data);
}

export function editProject(data) {
  return HttpClient.updateProject(data);
}

export function getAllTags(data) {
  return HttpClient.fetchTags(data);
}

export function addTag(data) {
  return HttpClient.postTag(data);
}

export function removeTag(data) {
  return HttpClient.deleteTag(data);
}

export function editFormValues(data) {
  return HttpClient.putBoardJsonAttributes(data);
}

export function boardCustomAttributes(data) {
  return HttpClient.postCustomAttributes(data);
}

export function fetchStatuses(data) {
  return HttpClient.getStatuses(data);
}

export function postStatus(data) {
  return HttpClient.postPlaybookStatus(data);
}

export function putStatus(data) {
  return HttpClient.putPlaybookStatus(data);
}

export function removeStatus(data) {
  return HttpClient.deletePlaybookStatus(data);
}

export function fetchAnotherStatuses(data) {
  return HttpClient.getAnotherStatuses(data);
}

export function singleStatus(data) {
  return HttpClient.getSingleStatus(data);
}
