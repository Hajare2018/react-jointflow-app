import HttpClient from './HttpClient';

export function requestCloneProject(data) {
  return HttpClient.cloneProject(data);
}

export function requestCloneDocument(data) {
  return HttpClient.cloneDocument(data);
}
