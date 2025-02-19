import HttpClient from './HttpClient';

export function requestCrmDeals(data) {
  return HttpClient.getCrmDeals(data);
}
export function requestCrmDealsBySearch(data) {
  return HttpClient.getCrmDealsBySearch(data);
}

export function requestSingleCrmDeal(data) {
  return HttpClient.getCrmDeal(data);
}

export function requestCrmCompany(data) {
  return HttpClient.getCrmCompany(data);
}

export function requestCrmContacts(data) {
  return HttpClient.postCrmContacts(data);
}

export function requestCrmConnections(data) {
  return HttpClient.checkCrmConnection(data);
}

export function requestCrmStatus(data) {
  return HttpClient.fetchCrmStatus(data);
}

export function crmFeedback(data) {
  return HttpClient.crmSync(data);
}
