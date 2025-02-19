import { createAction } from 'redux-actions';
import {
  CREATE_PROJECT,
  DELETE_PLAYBOOK_STATUS,
  FETCH_ANOTHER_STATUSES,
  FETCH_SINGLE_STATUS,
  FETCH_STATUSES,
  FETCH_TAGS,
  POST_CUSTOM_ATTRIBUTES,
  POST_PLAYBOOK_STATUS,
  PUT_FORM_VALUES,
  PUT_PLAYBOOK_STATUS,
} from '../Constants/actionTypes';
import * as Project from '../../Api/create-project';
import projectData, {
  anotherStatusesData,
  boardCustomAttributesData,
  singleStatusData,
  statusesData,
  tagsData,
} from '../Reducers/create-project';
import requestDocumentsData, { requestProjectsInLiteView } from './documents-data';
import { setMessage, show } from './loader';
import requestSingleProject from './single-project';
import { showSuccessSnackbar } from './snackbar';
import { handleError } from '../../components/Utils';
import { reload } from './reload-data';

const postProjectData = createAction(CREATE_PROJECT);
const project_tags = createAction(FETCH_TAGS);
const form_values = createAction(PUT_FORM_VALUES);
const post_custom_attributes = createAction(POST_CUSTOM_ATTRIBUTES);
const fetch_statuses = createAction(FETCH_STATUSES);
const fetch_another_statuses = createAction(FETCH_ANOTHER_STATUSES);
const fetch_single_status = createAction(FETCH_SINGLE_STATUS);
const post_status = createAction(POST_PLAYBOOK_STATUS);
const put_status = createAction(PUT_PLAYBOOK_STATUS);
const delete_status = createAction(DELETE_PLAYBOOK_STATUS);

const pathname = window.location.href.split('/').includes('localhost:3000');

export default function postProject(params) {
  return (dispatch) =>
    Project.createProject(params)
      .then((data) => {
        dispatch(show(false));
        if (params?.data?.is_template === 'False') {
          const pathname = window.location.href.split('/').includes('localhost:3000');
          if (pathname) {
            window.open(
              `http://localhost:3000/board/?id=${data?.data?.id}&navbars=True&actions=True`,
              '_self',
            );
          } else {
            window.open(`/board/?id=${data?.data?.id}&navbars=True&actions=True`, '_self');
          }
        } else if (params?.data?.is_template === 'True') {
          dispatch(requestSingleProject({ id: data?.data?.id }));
          setTimeout(() => {
            dispatch(reload({ show: true, id: data?.data?.id }));
          }, 2000);
        }
        dispatch(showSuccessSnackbar(data?.data?.details));
        dispatch(
          requestDocumentsData({
            filterByTemplate: params?.filterByTemplate,
          }),
        );
        dispatch(postProjectData(data));
        dispatch(projectData({ data: data.data, errors: null }, CREATE_PROJECT));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function updateProject(params) {
  return (dispatch) =>
    Project.editProject(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          if (params.liteview) {
            if (params.filter === 'my_team_boards') {
              dispatch(
                requestProjectsInLiteView({
                  closedBoards: params.closedBoards,
                  my_team_boards: true,
                }),
              );
            } else if (params.filter === 'all') {
              dispatch(
                requestProjectsInLiteView({
                  closedBoards: params.closedBoards,
                }),
              );
            } else {
              dispatch(
                requestProjectsInLiteView({
                  closedBoards: params.closedBoards,
                  owner: params.filter,
                }),
              );
            }
          }
          if (typeof params?.id !== 'undefined') {
            dispatch(requestSingleProject({ id: params?.id }));
          }
          if (params.is_crm) {
            if (pathname) {
              window.open(
                `http://localhost:3000/board/?id=${params?.id}&navbars=True&actions=True`,
                '_self',
              );
            } else {
              window.open(`/board/?id=${params?.id}&navbars=True&actions=True`, '_self');
            }
          }
          dispatch(showSuccessSnackbar(data?.data?.details));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

function requestAllTags(params) {
  return (dispatch) =>
    Project.getAllTags(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(project_tags(data));
          dispatch(tagsData({ data: data.data, errors: null }, FETCH_TAGS));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function saveTag(params) {
  return (dispatch) =>
    Project.addTag(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(requestAllTags({ id: params.data.board }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function removeTag(params) {
  return (dispatch) =>
    Project.removeTag(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(requestAllTags({ id: params.board }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestUpdateFormValues(params) {
  return (dispatch) =>
    Project.editFormValues(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(showSuccessSnackbar(data.data.details));
          dispatch(form_values(data));
          dispatch(requestSingleProject({ id: params?.board }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function saveCustomAttributes(params) {
  return (dispatch) =>
    Project.boardCustomAttributes(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          if (params.dry_run) {
            dispatch(setMessage(data.data.details));
          } else {
            dispatch(showSuccessSnackbar(data.data.details));
          }
          dispatch(post_custom_attributes(data));
          dispatch(boardCustomAttributesData(data));
          dispatch(requestSingleProject({ id: params?.board }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestStatuses(params) {
  return (dispatch) =>
    Project.fetchStatuses(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(fetch_statuses(data));
          dispatch(statusesData({ data: data.data, errors: null }, FETCH_STATUSES));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestAnotherStatuses(params) {
  return (dispatch) =>
    Project.fetchAnotherStatuses(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(fetch_another_statuses(data));
          dispatch(anotherStatusesData({ data: data.data, errors: null }, FETCH_ANOTHER_STATUSES));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestSingleStatus(params) {
  return (dispatch) =>
    Project.singleStatus(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(fetch_single_status(data));
          dispatch(singleStatusData({ data: data.data, errors: null }, FETCH_SINGLE_STATUS));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function savePlaybookStatus(params) {
  return (dispatch) =>
    Project.postStatus(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(showSuccessSnackbar(data.data.details));
          dispatch(requestStatuses({ id: params.data.board }));
          dispatch(post_status(data));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function updatePlaybookStatus(params) {
  return (dispatch) =>
    Project.putStatus(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(requestStatuses({ id: params.board }));
          dispatch(showSuccessSnackbar(data.data.details));
          dispatch(put_status(data));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function removePlaybookStatus(params) {
  return (dispatch) =>
    Project.removeStatus(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(requestStatuses({ id: params.board }));
          dispatch(showSuccessSnackbar(data.data.details));
          dispatch(delete_status(data));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}
