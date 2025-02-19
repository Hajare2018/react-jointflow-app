import { createAction } from 'redux-actions';
import {
  FETCH_DOCUMENTS_TYPE,
  POST_DOCUMENTS_TYPE,
  UPDATE_DOCUMENTS_TYPE,
  FETCH_SINGLE_DOCUMENTS_TYPE,
} from '../Constants/actionTypes';
import * as DocumentsType from '../../Api/documents-type';
import documentsType, { documentsTypeData } from '../Reducers/documents-type';
import { keepData, show, showPrompt } from './loader';
import { showSuccessSnackbar } from './snackbar';
import { handleError } from '../../components/Utils';

const getDocumentsType = createAction(FETCH_DOCUMENTS_TYPE);
const singleDocumentsType = createAction(FETCH_SINGLE_DOCUMENTS_TYPE);
const postDocumentsType = createAction(POST_DOCUMENTS_TYPE);
const editDocumentsType = createAction(UPDATE_DOCUMENTS_TYPE);

const internalErr = 'Error: Request failed with status code 500';
const badReq = 'Error: Request failed with status code 400';

export function requestDocumentsType(params) {
  return (dispatch) =>
    DocumentsType.fetchDocumentsType(params)
      .then((data) => {
        setTimeout(() => {
          dispatch(show(false));
        }, 3000);
        dispatch(getDocumentsType(data));
        dispatch(documentsType({ data: data.data, errors: null }, FETCH_DOCUMENTS_TYPE));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestSingleType(params) {
  return (dispatch) =>
    DocumentsType.fetchSingleDocumentsType(params)
      .then((data) => {
        dispatch(show(false));
        dispatch(showPrompt(true));
        dispatch(singleDocumentsType(data));
        dispatch(documentsTypeData({ data: data.data, errors: null }, FETCH_SINGLE_DOCUMENTS_TYPE));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function sendDocumentsType(params) {
  return (dispatch) =>
    DocumentsType.createDocumentsType(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(keepData(true));
          dispatch(showSuccessSnackbar(data?.data?.details));
          dispatch(requestSingleType({ id: data?.data?.data?.id }));
          dispatch(requestDocumentsType());
        }
        dispatch(postDocumentsType(data.data));
      })
      .catch((error) => {
        handleError(error, dispatch);
        if (error.toString() == internalErr && error.toString() == badReq) {
          dispatch(keepData(true));
        }
      });
}

export function putDocumentsType(params) {
  return (dispatch) =>
    DocumentsType.updateDocumentsType(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(keepData(true));
          dispatch(showSuccessSnackbar(data?.data?.details));
          dispatch(requestSingleType({ id: data?.data?.data?.id }));
          dispatch(requestDocumentsType());
        }
        dispatch(editDocumentsType(data));
      })
      .catch((error) => {
        handleError(error, dispatch);
        if (error.toString() == internalErr && error.toString() == badReq) {
          dispatch(keepData(true));
        }
      });
}
