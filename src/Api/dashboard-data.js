import HttpClient from './HttpClient';

export function requestProjectsData(data) {
  return HttpClient.getProjectData(data);
}

export function getProjectLiteView(data) {
  return HttpClient.projectLiteView(data);
}

export function requestProjectsInsights(data) {
  return HttpClient.getProjectInsights(data);
}

export function editProjectInsight(data) {
  return HttpClient.putProjectInsights(data);
}

export function fetchContents(data) {
  return HttpClient.getContents(data);
}

export function sendContent(data) {
  return HttpClient.postContent(data);
}

export function editContent(data) {
  return HttpClient.putContent(data);
}
