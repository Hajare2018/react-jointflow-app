import HttpClient from '../HttpClient';

export function fetchTenants(data) {
  return HttpClient.fetchAllTenants(data);
}

export function newTenant(data) {
  return HttpClient.createNewTenant(data);
}
