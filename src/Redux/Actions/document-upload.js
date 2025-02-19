import { createAction } from 'redux-actions';
import {
  GET_DOCUMENTS_DATA,
  UPLOAD_DOCUMENT,
  EDIT_DOCUMENT,
  SINGLE_CARD_DOCS,
  GET_DOCUMENT_CLAUSES,
  GET_SINGLE_CLAUSE,
  GET_CLAUSE_LIBRARY,
} from '../Constants/actionTypes';
import * as Documents from '../../Api/documents-upload';
import { setMessage, show } from './loader';
import {
  clauseLibraryData,
  clausesData,
  singleCardDocs,
  singleClausesData,
  uploadedDocs,
} from '../Reducers/document-upload';
import requestSingleProject from './single-project';
import { showErrorSnackbar, showSuccessSnackbar, showWarningSnackbar } from './snackbar';
import { handleError } from '../../components/Utils';
import { requestProjectLiteView } from './dashboard-data';
import getSingleTask from './single-task';

const fetchDocs = createAction(GET_DOCUMENTS_DATA);
const uploadDocs = createAction(UPLOAD_DOCUMENT);
const editedDoc = createAction(EDIT_DOCUMENT);
const docsByCard = createAction(SINGLE_CARD_DOCS);
const fetchAllClauses = createAction(GET_DOCUMENT_CLAUSES);
const singleClause = createAction(GET_SINGLE_CLAUSE);
const clauseLibrary = createAction(GET_CLAUSE_LIBRARY);

export function getDocsList(params) {
  return (dispatch) =>
    Documents.getAllDocuments(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
        }
        if (data.data.length > 0) {
          dispatch(setMessage('Loading...'));
        } else {
          dispatch(setMessage('No Record found!'));
        }
        dispatch(fetchDocs(data));
        dispatch(uploadedDocs({ data: data.data, errors: null }, GET_DOCUMENTS_DATA));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function postDocumentData(params) {
  return (dispatch) =>
    Documents.uploadDocument(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          if (data?.data?.warning && data?.data?.warning_text !== null) {
            dispatch(showWarningSnackbar(data?.data?.warning_text));
          } else {
            dispatch(showSuccessSnackbar(data?.data?.details));
          }
          if (params?.fetchDocList) {
            dispatch(getSingleCardDocs({ doc_id: params.card_id, archived: false }));
            dispatch(requestSingleProject({ id: params.board_id }));
          } else if (params?.allDocs) {
            dispatch(
              getDocsList({
                id: null,
                archived: params.archived,
                isTemplate: params.isTemplate,
                categories: true,
              }),
            );
          } else if (params?.liteView) {
            dispatch(requestProjectLiteView({ board: params.board_id }));
          } else {
            return;
          }
        }
        dispatch(uploadDocs(data));
        // dispatch(uploadDocument({ data: data.data, errors: null }, UPLOAD_DOCUMENT))
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function updateDocument(params) {
  return (dispatch) =>
    Documents.editDocument(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(showSuccessSnackbar(data?.data?.details));
          if (params.refresh) {
            if (params.card_id !== null) {
              // dispatch(
              //   getSingleCardDocs({ doc_idid: params.card_id, archived: false })
              // );
              dispatch(getSingleTask({ card_id: params.card_id, task_info: false }));
            } else {
              dispatch(getDocsList({ id: null, archived: false }));
            }
            if (params.board_id !== null) {
              dispatch(requestSingleProject({ id: params.board_id }));
            } else {
              return;
            }
          }
        }
        dispatch(editedDoc(data));
        // dispatch(uploadDocument({ data: data.data, errors: null }, UPLOAD_DOCUMENT))
      })
      .catch((error) => {
        const errorMsg = 'Error: Request failed with status code 413';
        handleError(error, dispatch);
        if (error.toString() === errorMsg) {
          dispatch(showErrorSnackbar('File is too large to save!'));
        }
      });
}

export function getSingleCardDocs(params) {
  return (dispatch) =>
    Documents.getAllDocuments(params)
      .then((data) => {
        if (data) {
          dispatch(docsByCard(data));
          dispatch(singleCardDocs({ data: data.data, errors: null }, SINGLE_CARD_DOCS));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestClauseList(params) {
  return (dispatch) =>
    Documents.getAllClauses(params)
      .then((data) => {
        dispatch(show(false));
        if (data.status === 200) {
          dispatch(setMessage('Loading...'));
          if (!data.data.length) {
            dispatch(setMessage('No Record found.'));
          } else {
            setTimeout(() => {
              dispatch(
                setMessage(params.hidden ? 'No hidden records' : 'No approved version found.'),
              );
            }, 4000);
          }
        }
        dispatch(fetchAllClauses(data));
        dispatch(clausesData({ data: data.data, errors: null }, GET_DOCUMENT_CLAUSES));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestSingleClause(params) {
  return (dispatch) =>
    Documents.getSingleClause(params)
      .then((data) => {
        dispatch(show(false));
        if (data.status === 200) {
          dispatch(setMessage('Loading...'));
          if (!data.data.length) {
            dispatch(setMessage('No approved version found.'));
          }
        }
        dispatch(singleClause(data));
        dispatch(singleClausesData({ data: data.data, errors: null }, GET_SINGLE_CLAUSE));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function updateClause(params) {
  return (dispatch) =>
    Documents.editClause(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(showSuccessSnackbar(data?.data?.details));
          if (params?.stareClauses) {
            dispatch(requestClauseList({ doc_id: params.doc_id, stareClauses: true }));
          } else if (params?.modified) {
            dispatch(requestClauseList({ doc_id: params.doc_id, modified: true }));
          } else if (params?.hidden) {
            dispatch(requestClauseList({ doc_id: params.doc_id, hidden: true }));
          } else {
            dispatch(requestClauseList({ doc_id: params.doc_id, hidden: false }));
          }
        }
        dispatch(singleClause(data));
        dispatch(singleClausesData({ data: data.data, errors: null }, GET_SINGLE_CLAUSE));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestClauseLibrary(params) {
  return (dispatch) =>
    Documents.getClauseLibrary(params)
      .then((data) => {
        dispatch(show(false));
        if (data.status === 200) {
          dispatch(setMessage('Loading...'));
          if (!data.data.length) {
            dispatch(setMessage('No approved version found.'));
          }
        }
        dispatch(clauseLibrary(data));
        dispatch(clauseLibraryData({ data: data.data, errors: null }, GET_CLAUSE_LIBRARY));
      })
      .catch((error) => {
        const errorMsg = 'Error: Request failed with status code 413';
        handleError(error, dispatch);
        if (error.toString() === errorMsg) {
          dispatch(showErrorSnackbar('File is too large to save!'));
        }
      });
}
