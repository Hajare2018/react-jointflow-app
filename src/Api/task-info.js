import HttpClient from './HttpClient';

export function postTaskData(data) {
  return HttpClient.saveTask(data);
}

export function putTaskData(data) {
  return HttpClient.updateTask(data);
}

export function fetchAllAssignees(data) {
  return HttpClient.fetchAssignees(data);
}

export function getTaskSteps(data) {
  return HttpClient.fetchTaskSteps(data);
}

export function postTaskSteps(data) {
  return HttpClient.createTaskSteps(data);
}

export function putTaskSteps(data) {
  return HttpClient.editTaskSteps(data);
}

export function populateFromType(data) {
  return HttpClient.populateFromType(data);
}
