import HttpClient from './HttpClient';

export function fetchSingleProject(data) {
  return HttpClient.getSingleProject(data);
}

export function putTaskPreview(data) {
  return HttpClient.saveTasksPreview(data);
}

export function putMeddpicc(data) {
  return HttpClient.editMeddpicc(data);
}
