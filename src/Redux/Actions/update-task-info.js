import { createAction } from 'redux-actions';
import { UPDATE_TASK_INFO } from '../Constants/actionTypes';
import * as Tasks from '../../Api/task-info';
import updatedTasksData from '../Reducers/update-task-info';
import { keepData, show } from './loader';
import requestSingleProject from './single-project';
import requestProject, { requestProjectLiteView } from './dashboard-data';
import { completed } from './completed-value';
import getSingleTask, { getFilteredTasks } from './single-task';
import { showErrorSnackbar, showSuccessSnackbar } from './snackbar';
import { handleError } from '../../components/Utils';
import { requestPopulateFromType } from './task-info';
import { postComments } from './comments';
import updateJiraTicket from '../../Api/update-jira-ticket';

const updateTask = createAction(UPDATE_TASK_INFO);

export default function editTaskData(params) {
  return (dispatch) =>
    Tasks.putTaskData(params)
      .then((data) => {
        updateJiraTicket({
          boardId: params.board,
          taskId: params.id,
          title: params.title,
          description: params.description,
        });
        if (data) {
          dispatch(show(false));
          // dispatch(keepData(false));
          dispatch(showSuccessSnackbar(data?.data?.details));
          if (params?.populateFromType) {
            const reqBody = {
              task_type_id: parseInt(params.task_type),
              card_id: params.id,
              target_object: 'both',
              action: 'replace',
            };
            dispatch(requestPopulateFromType({ data: reqBody }));
            dispatch(
              getSingleTask({
                card_id: params.id,
                board_id: params?.board,
                task_info: false,
              }),
            );
            dispatch(requestSingleProject({ id: params.board }));
          } else if (params.isComment) {
            dispatch(postComments(params.forComment));
          } else if (params.forTemplates) {
            dispatch(requestSingleProject({ id: params.board }));
          } else if (params.fetchCards) {
            dispatch(requestProject({ id: params?.board, filteredByBoard: true }));
            dispatch(requestSingleProject({ id: params.board }));
          } else if (params?.cards?.length > 0) {
            if (params.fetchByType) {
              dispatch(requestProject({ task_type: params.task_type }));
            }
            dispatch(requestProject({ task_type: params.type }));
          } else if (params.completed) {
            dispatch(requestProject({ task_type__completed: params.type }));
          } else if (params.fetchByOrder) {
            dispatch(
              requestProject({
                task_type__asc_ordering: params.task_type__asc_ordering,
                orderBy: params.orderBy,
              }),
            );
          } else if (data?.data?.is_complete) {
            dispatch(completed(data?.data?.is_complete));
          } else if (params.task_info) {
            dispatch(
              getSingleTask({
                card_id: params.id,
                board_id: params?.board,
                task_info: true,
              }),
            );
            dispatch(requestSingleProject({ id: params.board }));
            dispatch(requestSingleProject({ id: params.board, header: true }));
          } else if (params?.forBoard) {
            dispatch(requestSingleProject({ id: params.board }));
            dispatch(requestSingleProject({ id: params.board, header: true }));
          } else if (params?.fetchAll) {
            dispatch(requestProject({ allCards: true }));
          } else if (params?.filteredTasks?.allCards) {
            dispatch(
              getFilteredTasks({
                user_id: params.userId,
                allCards: params?.filteredTasks?.allCards,
              }),
            );
          } else if (params?.filteredTasks?.completed) {
            dispatch(
              getFilteredTasks({
                user_id: params.userId,
                completed: params?.filteredTasks?.completed,
              }),
            );
          } else if (params?.filteredTasks?.upcoming) {
            dispatch(
              getFilteredTasks({
                user_id: params.userId,
                upcoming: params?.filteredTasks?.upcoming,
              }),
            );
          } else if (params?.filterList) {
            dispatch(
              getFilteredTasks({
                user_id: params.userId,
                filterList: true,
                type: params.type,
                status: params.status,
              }),
            );
          } else if (params?.legalTasks?.isLegal) {
            dispatch(requestProject({ isLegal: params?.legalTasks?.isLegal }));
          } else if (params?.legalTasks?.isLegal__completed) {
            dispatch(
              requestProject({
                isLegal__completed: params?.legalTasks?.isLegal__completed,
              }),
            );
          } else if (params?.legalTasks?.isLegal__upcoming) {
            dispatch(
              requestProject({
                isLegal__upcoming: params?.legalTasks?.isLegal__upcoming,
              }),
            );
          } else if (params.liteView) {
            dispatch(
              getSingleTask({
                card_id: params.id,
                task_info: false,
                maap_task: true,
              }),
            );
            dispatch(requestProjectLiteView({ board: params.board }));
          }
        }
        dispatch(updateTask(data));
        dispatch(updatedTasksData({ data: data.data, errors: null }, UPDATE_TASK_INFO));
      })
      .catch((error) => {
        dispatch(keepData(true));
        if (error?.response?.data?.details === "RuntimeError('Circular reference detected.')") {
          dispatch(
            showErrorSnackbar(
              'Could not save the Task as there is a circular reference, try referencing a different Task.',
            ),
          );
        } else {
          handleError(error, dispatch);
        }
      });
}
