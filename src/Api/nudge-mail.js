import HttpClient from './HttpClient';

export function doNudge(data) {
  return HttpClient.postMail(data);
}

export function sendActivationMail(data) {
  return HttpClient.postReactivationMail(data);
}

export function sendResetPassMail(data) {
  return HttpClient.passwordResetMail(data);
}
