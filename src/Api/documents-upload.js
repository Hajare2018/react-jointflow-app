import HttpClient from './HttpClient';

export function getAllDocuments(data) {
  return HttpClient.fetchUploadedDocs(data);
}

export function uploadDocument(data) {
  return HttpClient.postDocument(data);
}

export function editDocument(data) {
  return HttpClient.putDocument(data);
}

export function getAllClauses(data) {
  return HttpClient.fetchClauses(data);
}

export function getSingleClause(data) {
  return HttpClient.fetchSingleClause(data);
}

export function editClause(data) {
  return HttpClient.putClause(data);
}

export function getClauseLibrary(data) {
  return HttpClient.fetchClauseLibrary(data);
}
