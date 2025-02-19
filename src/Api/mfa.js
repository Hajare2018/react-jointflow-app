import HttpClient from './HttpClient';

export function getSecretUrl(data) {
  return HttpClient.fetchSecretUrl(data);
}

export function sendOtp(data) {
  return HttpClient.postOtp(data);
}

export function token2(data) {
  return HttpClient.getToken2(data);
}

export function getRefresh(data) {
  return HttpClient.refreshToken(data);
}

export function loginWithOtp(data) {
  return HttpClient.otpLogin(data);
}

export function postNewPasswordEmail(data) {
  return HttpClient.newPasswordEmail(data);
}

export function postResetMFAEmail(data) {
  return HttpClient.resetUserMFA(data);
}
