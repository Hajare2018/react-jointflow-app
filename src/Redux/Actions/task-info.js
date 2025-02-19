import { createAction } from 'redux-actions';
import {
  CREATE_TASK_STEPS,
  EDIT_TASK_STEPS,
  FETCH_ASSIGNEES,
  FETCH_TASK_STEPS,
  POPULATE_FROM_TYPE,
  SAVE_TASK_INFO,
} from '../Constants/actionTypes';
import * as Tasks from '../../Api/task-info';
import saveTasksData, {
  assigneesData,
  createdStepData,
  populatedFromType,
  taskStepData,
  updatedStepData,
} from '../Reducers/task-info';
import { show } from './loader';
import requestProject from './dashboard-data';
import requestSingleProject from './single-project';
import getSingleTask from './single-task';
import { showSuccessSnackbar } from './snackbar';
import { reload } from './reload-data';
import { handleError } from '../../components/Utils';

const saveTask = createAction(SAVE_TASK_INFO);
const assignees = createAction(FETCH_ASSIGNEES);
const taskSteps = createAction(FETCH_TASK_STEPS);
const create_steps = createAction(CREATE_TASK_STEPS);
const edit_steps = createAction(EDIT_TASK_STEPS);
const populate_from_type = createAction(POPULATE_FROM_TYPE);

const noFoundErr = 'Error: Request failed with status code 404';

export default function postTaskData(params) {
  return (dispatch) =>
    Tasks.postTaskData(params)
      .then((data) => {
        dispatch(showSuccessSnackbar(data?.data?.details));
        if (data) {
          if (params?.reload) {
            dispatch(reload({ add: false, task_data: data?.data }));
            dispatch(reload({ clone: false, task_data: data?.data }));
          }
          if (params?.populateFromType) {
            const reqBody = {
              task_type_id: parseInt(params.task_type),
              card_id: data?.data?.data?.id,
              target_object: 'both',
              action: 'replace',
            };
            dispatch(requestPopulateFromType({ data: reqBody }));
          }
          dispatch(
            getSingleTask({
              card_id: data?.data?.data?.id,
              board_id: params?.board,
              task_info: params?.task_info,
            }),
          );
          if (params?.for_legal) {
            dispatch(requestProject({ task_type: 'Legal Task' }));
          }
          if (params.board !== null) {
            dispatch(requestSingleProject({ id: params.board }));
          } else {
            dispatch(requestProject({ allCards: true }));
          }
        }
        dispatch(saveTask(data));
        dispatch(saveTasksData({ data: data.data, errors: null }, SAVE_TASK_INFO));
      })
      .catch((error) => {
        if (error.toString() == noFoundErr) {
          return;
        } else {
          handleError(error, dispatch);
        }
      });
}

export function getAssignees(params) {
  return (dispatch) =>
    Tasks.fetchAllAssignees(params)
      .then((data) => {
        dispatch(show(false));
        dispatch(assignees(data));
        dispatch(assigneesData({ data: data.data, errors: null }, FETCH_ASSIGNEES));
      })
      .catch((error) => {
        if (error.toString() == noFoundErr) {
          return;
        } else {
          handleError(error, dispatch);
        }
      });
}

export function requestTaskSteps(params) {
  return (dispatch) =>
    Tasks.getTaskSteps(params)
      .then((data) => {
        dispatch(show(false));
        dispatch(taskSteps(data));
        dispatch(taskStepData({ data: data.data, errors: null }, FETCH_TASK_STEPS));
      })
      .catch((error) => {
        if (error.toString() == noFoundErr) {
          return;
        } else {
          handleError(error, dispatch);
        }
      });
}

export function saveTaskSteps(params) {
  return (dispatch) =>
    Tasks.postTaskSteps(params)
      .then((data) => {
        dispatch(show(false));
        dispatch(showSuccessSnackbar(data?.data?.details));
        dispatch(
          requestTaskSteps({
            id: params.card,
            fetchByTaskType: params.isTaskType,
          }),
        );
        dispatch(create_steps(data));
        dispatch(createdStepData({ data: data.data, errors: null }, CREATE_TASK_STEPS));
      })
      .catch((error) => {
        if (error.toString() == noFoundErr) {
          return;
        } else {
          handleError(error, dispatch);
        }
      });
}

export function updateTaskSteps(params) {
  return (dispatch) =>
    Tasks.putTaskSteps(params)
      .then((data) => {
        dispatch(show(false));
        dispatch(showSuccessSnackbar(data?.data?.details));
        dispatch(
          requestTaskSteps({
            id: params.card,
            fetchByTaskType: params.isType,
          }),
        );
        dispatch(requestSingleProject({ id: params.board }));
        dispatch(edit_steps(data));
        dispatch(updatedStepData({ data: data.data, errors: null }, EDIT_TASK_STEPS));
      })
      .catch((error) => {
        if (error.toString() == noFoundErr) {
          return;
        } else {
          handleError(error, dispatch);
        }
      });
}

export function requestPopulateFromType(params) {
  return (dispatch) =>
    Tasks.populateFromType(params)
      .then((data) => {
        dispatch(show(false));
        dispatch(showSuccessSnackbar(data?.data?.details));
        // if (params.data.target_object === "steps") {
        //   dispatch(handleTabsChange(2));
        // } else if (params.data.target_object === "docs") {
        //   dispatch(handleTabsChange(1));
        //   dispatch(
        //     getSingleTask({ card_id: params.data.card_id, task_info: false })
        //   );
        // } else {
        //   dispatch(handleTabsChange(0));
        // }
        // dispatch(displayDialog(false));
        // setTimeout(() => {
        //   if (data?.data?.prompt_user) {
        //     dispatch(displayDialog(true));
        //   } else {
        //     return;
        //   }
        // }, 2000);
        dispatch(populate_from_type(data));
        dispatch(populatedFromType({ data: data.data, errors: null }, POPULATE_FROM_TYPE));
      })
      .catch((error) => {
        handleError(error, dispatch);
        // if (
        //   error.toString() === badReq ||
        //   error.toString() === internalErr ||
        //   error.toString() === noFoundErr
        // ) {
        //   dispatch(displayDialog(true));
        // }
      });
}
