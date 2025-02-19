import { createAction } from 'redux-actions';
import {
  CREATE_BOARD_COMMENTS,
  CREATE_COMMENTS,
  FETCH_BOARD_COMMENTS,
  FETCH_COMMENTS,
  UPDATE_BOARD_COMMENT,
  UPDATE_COMMENT,
} from '../Constants/actionTypes';
import * as Comments from '../../Api/comments';
import {
  boardCommentsData,
  commentsData,
  postedBoardComments,
  postedComments,
  updatedBoardComments,
  updatedComments,
} from '../Reducers/comments';
import { keepData, show } from './loader';
import { fetchData } from './store-data';
import { showSuccessSnackbar } from './snackbar';
import getSingleTask from './single-task';
import requestSingleProject from './single-project';
import { handleError } from '../../components/Utils';

const saveComments = createAction(FETCH_COMMENTS);
const boardComments = createAction(FETCH_BOARD_COMMENTS);
const createComments = createAction(CREATE_COMMENTS);
const create_board_comments = createAction(CREATE_BOARD_COMMENTS);
const updateComments = createAction(UPDATE_COMMENT);
const update_board_comments = createAction(UPDATE_BOARD_COMMENT);

export function getComments(params) {
  return (dispatch) =>
    Comments.fetchComments(params)
      .then((data) => {
        dispatch(saveComments(data));
        dispatch(commentsData({ data: data.data, errors: null }, FETCH_COMMENTS));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestBoardComments(params) {
  return (dispatch) =>
    Comments.fetchBoardComments(params)
      .then((data) => {
        dispatch(boardComments(data));
        dispatch(boardCommentsData({ data: data.data, errors: null }, FETCH_BOARD_COMMENTS));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function postComments(params) {
  return (dispatch) =>
    Comments.createComments(params)
      .then((data) => {
        dispatch(show(false));
        if (params.isLiteUI) {
          dispatch(showSuccessSnackbar(data?.data?.details));
          dispatch(getSingleTask({ card_id: params.card, task_info: false }));
          dispatch(keepData(false));
        } else if (!params.noRefresh) {
          dispatch(fetchData(false));
          dispatch(showSuccessSnackbar(data?.data?.details));
          dispatch(getComments({ id: params.card, page: 1 }));
          dispatch(getSingleTask({ card_id: params.card, task_info: true }));
        } else {
          dispatch(
            getSingleTask({ card_id: params.card, board_id: params.board, task_info: true }),
          );
          dispatch(requestSingleProject({ id: params.board }));
        }
        dispatch(createComments(data));
        dispatch(postedComments({ data: data.data, errors: null }, CREATE_COMMENTS));
      })
      .catch((error) => {
        dispatch(keepData(true));
        handleError(error, dispatch);
      });
}

export function saveBoardComments(params) {
  return (dispatch) =>
    Comments.createBoardComments(params)
      .then((data) => {
        dispatch(show(false));
        dispatch(showSuccessSnackbar(data?.data?.details));
        dispatch(requestBoardComments({ board_id: params.board_id }));
        // dispatch(requestSingleProject({ id: params.board_id }));
        dispatch(create_board_comments(data));
        dispatch(postedBoardComments({ data: data.data, errors: null }, CREATE_BOARD_COMMENTS));
      })
      .catch((error) => {
        dispatch(keepData(true));
        handleError(error, dispatch);
      });
}

export function editComments(params) {
  return (dispatch) =>
    Comments.updateComment(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(fetchData(false));
          dispatch(showSuccessSnackbar(data?.data?.details));
          dispatch(getComments({ id: params.data.card, page: params.page }));
        }
        dispatch(updateComments(data));
        dispatch(updatedComments({ data: data.data, errors: null }, UPDATE_COMMENT));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function editBoardComments(params) {
  return (dispatch) =>
    Comments.updateBoardComment(params)
      .then((data) => {
        dispatch(show(false));
        dispatch(showSuccessSnackbar(data?.data?.details));
        dispatch(requestBoardComments({ board_id: params.board_id }));
        dispatch(update_board_comments(data));
        dispatch(updatedBoardComments({ data: data.data, errors: null }, UPDATE_BOARD_COMMENT));
      })
      .catch((error) => {
        dispatch(keepData(true));
        handleError(error, dispatch);
      });
}
