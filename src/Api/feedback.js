import HttpClient from './HttpClient';

export function saveFeedback(data) {
  return HttpClient.postFeedback(data);
}

export function getFaqs(data) {
  return HttpClient.fetchFaqs(data);
}

export function getSingleFaq(data) {
  return HttpClient.singleFaq(data);
}

export function createFaq(data) {
  return HttpClient.addFaq(data);
}

export function editFaq(data) {
  return HttpClient.editFaq(data);
}
