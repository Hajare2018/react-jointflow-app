import { createAction } from 'redux-actions';
import {
  FETCH_SINGLE_PROJECT,
  FETCH_SINGLE_PROJECT_HEADER,
  PUT_MEDDPICC,
  PUT_TASK_PREVIEW,
} from '../Constants/actionTypes';
import * as Project from '../../Api/single-project';
import singleProjectData, {
  meddpiccData,
  singleProjectWithHeader,
  taskPreviews,
} from '../Reducers/single-project';
import { show, showPrompt } from './loader';
import { showErrorSnackbar, showSuccessSnackbar } from './snackbar';
import { handleError } from '../../components/Utils';

const fetchOneProject = createAction(FETCH_SINGLE_PROJECT);
const fetchProjectHeader = createAction(FETCH_SINGLE_PROJECT_HEADER);
const task_preview = createAction(PUT_TASK_PREVIEW);
const put_meddpicc = createAction(PUT_MEDDPICC);

const unAuthorisedErr = 'Error: Request failed with status code 401';

export default function requestSingleProject(params) {
  return (dispatch) =>
    Project.fetchSingleProject(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(showPrompt(false));
        }
        if (params.header) {
          dispatch(fetchProjectHeader(data));
          dispatch(
            singleProjectWithHeader({ data: data.data, errors: null }, FETCH_SINGLE_PROJECT_HEADER),
          );
        } else {
          dispatch(fetchOneProject(data));
          dispatch(singleProjectData({ data: data.data, errors: null }, FETCH_SINGLE_PROJECT));
        }
      })
      .catch((error) => {
        if (error) {
          dispatch(show(false));
        }
        if (error.toString() == unAuthorisedErr) {
          handleError(error, dispatch);
        }
        const internalErr = 'Error: Request failed with status code 500';
        const badReq = 'Error: Request failed with status code 400';
        if (error.toString() === internalErr) {
          dispatch(showErrorSnackbar('Internal Server Error occurred!'));
        }
        if (error.toString() === badReq) {
          dispatch(showErrorSnackbar('Bad Request!'));
        }
      });
}

export function postTaskPreviews(params) {
  return (dispatch) =>
    Project.putTaskPreview(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(showSuccessSnackbar(data?.data?.details));
        }
        dispatch(task_preview(data));
        dispatch(taskPreviews({ data: data.data, errors: null }, PUT_TASK_PREVIEW));
      })
      .catch((error) => {
        if (error) {
          dispatch(show(false));
        }
        const internalErr = 'Error: Request failed with status code 500';
        const badReq = 'Error: Request failed with status code 400';
        if (error.toString() === internalErr) {
          dispatch(showErrorSnackbar('Internal Server Error occurred!'));
        }
        if (error.toString() === badReq) {
          dispatch(showErrorSnackbar('Bad Request!'));
        }
      });
}

export function requestUpdateMeddpicc(params) {
  return (dispatch) =>
    Project.putMeddpicc(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(showSuccessSnackbar(data?.data?.details));
          dispatch(requestSingleProject({ id: params?.id, header: true }));
          dispatch(requestSingleProject({ id: params?.id }));
        }
        dispatch(put_meddpicc(data));
        dispatch(meddpiccData({ data: data.data, errors: null }, PUT_MEDDPICC));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}
