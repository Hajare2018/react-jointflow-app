import HttpClient from './HttpClient';

export function getData(data) {
  return HttpClient.fetchUuidData(data);
}

export function postTenantData(data) {
  return HttpClient.newTenant(data);
}

export function postSuperUserData(data) {
  return HttpClient.newSuperUser(data);
}

export function postSubDomainUuid(data) {
  return HttpClient.fetchSubDomainProp(data);
}
