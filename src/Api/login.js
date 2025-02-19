import HttpClient from './HttpClient';

export function fetchUser(data) {
  return HttpClient.userInfo(data);
}

export function fetchSingleUser(data) {
  return HttpClient.singleUser(data);
}

export function createUser(data) {
  return HttpClient.addUser(data);
}

export function updateUser(data) {
  return HttpClient.editUserInfo(data);
}

export function updateLiteUser(data) {
  return HttpClient.editLiteUser(data);
}

export function allUsers(data) {
  return HttpClient.fetchAllUsers(data);
}

export function getTenantValuesByName(data) {
  return HttpClient.fetchTenantValuesByName(data);
}

export function getTenantAttributes(data) {
  return HttpClient.fetchTenantAttributes(data);
}

export function sendTenantAttributes(data) {
  return HttpClient.postTenantAttributes(data);
}

export function updateTenantAttributes(data) {
  return HttpClient.putTenantAttributes(data);
}

export function patchPassword(data) {
  return HttpClient.forgotPassword(data);
}

export function addSlackId(data) {
  return HttpClient.postSlackId(data);
}

export function test(data) {
  return HttpClient.testUserEmail(data);
}

export function fetchVendorDetails(data) {
  return HttpClient.vendorDetails(data);
}

export function getNotifications(data) {
  return HttpClient.fetchNotifications(data);
}

export function passwordResetMail(data) {
  return HttpClient.sendPasswordResetMail(data);
}

export function maapLink(data) {
  return HttpClient.getMaapLink(data);
}

export function groupViewLink(data) {
  return HttpClient.getGroupViewLink(data);
}

export function reassignOwner(data) {
  return HttpClient.reassignOwner(data);
}
