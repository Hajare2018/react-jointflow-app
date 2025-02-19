import { createAction } from 'redux-actions';
import { FETCH_FILTERED_TASKS, FETCH_SINGLE_CARD } from '../Constants/actionTypes';
import * as Task from '../../Api/single-task';
import { show } from './loader';
import singleCardData, { filteredCardsData } from '../Reducers/single-task';
import { handleErrorOnLitePages } from '../../components/Utils';

const fetchOneCard = createAction(FETCH_SINGLE_CARD);
const filteredCards = createAction(FETCH_FILTERED_TASKS);

const noFoundErr = 'Error: Request failed with status code 404';

export default function getSingleTask(params) {
  return (dispatch) =>
    Task.requestSingleCard(params)
      .then((data) => {
        setTimeout(() => {
          dispatch(show(false));
        }, 3000);
        dispatch(fetchOneCard(data));
        dispatch(singleCardData({ data: data.data, errors: null }, FETCH_SINGLE_CARD));
      })
      .catch((error) => {
        if (error.toString() == noFoundErr) {
          return;
        } else {
          handleErrorOnLitePages(error, dispatch);
        }
      });
}

export function getFilteredTasks(params) {
  return (dispatch) =>
    Task.requestFilteredCard(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
        }
        dispatch(filteredCards(data));
        dispatch(filteredCardsData({ data: data.data, errors: null }, FETCH_FILTERED_TASKS));
      })
      .catch((error) => {
        if (error.toString() == noFoundErr) {
          return;
        } else {
          handleErrorOnLitePages(error, dispatch);
        }
      });
}
