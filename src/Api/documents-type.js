import HttpClient from './HttpClient';

export function fetchDocumentsType(data) {
  return HttpClient.getDocumentsType(data);
}

export function fetchSingleDocumentsType(data) {
  return HttpClient.singleDocumentsType(data);
}

export function createDocumentsType(data) {
  return HttpClient.postDocumentsType(data);
}

export function updateDocumentsType(data) {
  return HttpClient.editDocumentsType(data);
}
