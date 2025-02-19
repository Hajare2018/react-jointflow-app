import HttpClient from './HttpClient';

export function fetchComments(data) {
  return HttpClient.loadComments(data);
}

export function fetchBoardComments(data) {
  return HttpClient.loadBoardComments(data);
}

export function createComments(data) {
  return HttpClient.postComments(data);
}

export function createBoardComments(data) {
  return HttpClient.postBoardComments(data);
}

export function updateComment(data) {
  return HttpClient.putComments(data);
}

export function updateBoardComment(data) {
  return HttpClient.putBoardComments(data);
}
