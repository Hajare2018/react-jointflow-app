import HttpClient from './HttpClient';

export function fetchCompanies(data) {
  return HttpClient.getCompanies(data);
}

export function addCompany(data) {
  return HttpClient.postCompany(data);
}

export function editCompany(data) {
  return HttpClient.putCompany(data);
}

export function fetchOneCompany(data) {
  return HttpClient.fetchCompanyDetails(data);
}

export function companyFavIcon(data) {
  return HttpClient.fetchFavIcon(data);
}

export function companyAccess(data) {
  return HttpClient.giveCompanyAccess(data);
}

export function companyHierarchy(data) {
  return HttpClient.fetchCompanyHierarchy(data);
}
