import HttpClient from './HttpClient';

export function requestSingleCard(data) {
  return HttpClient.fetchSingleCard(data);
}

export function requestFilteredCard(data) {
  return HttpClient.fetchFilteredCards(data);
}
