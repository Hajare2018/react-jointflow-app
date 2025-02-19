import HttpClient from './HttpClient';

export function requestDocumentsData(data) {
  return HttpClient.getDocumentsData(data);
}

export function projectsLiteView(data) {
  return HttpClient.getProjectsLite(data);
}

export function projectsCompanyView(data) {
  return HttpClient.getProjectsByCompany(data);
}
