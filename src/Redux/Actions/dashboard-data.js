import { createAction } from 'redux-actions';
import {
  ALL_CONTENTS,
  FETCH_CONTENTS,
  FETCH_DASHBOARD_DATA,
  FETCH_DASHBOARD_LITE,
  FETCH_INSIGHTS,
  FETCH_TASK_VIEW,
  POST_CONTENTS,
  PUT_INSIGHTS,
  SINGLE_CONTENTS,
  UPDATE_CONTENTS,
} from '../Constants/actionTypes';
import * as Dashboard from '../../Api/dashboard-data';
import dashboardData, {
  allContentsData,
  contentsData,
  dashboardLiteData,
  insightsData,
  singleContentData,
  taskViewData,
} from '../Reducers/dashboard-data';
import { setMessage, show } from './loader';
import { handleError, handleErrorOnLitePages } from '../../components/Utils';
import { showSuccessSnackbar } from './snackbar';

const fetchDashboardData = createAction(FETCH_DASHBOARD_DATA);
const dashboardLiteView = createAction(FETCH_DASHBOARD_LITE);
const taskView = createAction(FETCH_TASK_VIEW);
const fetchInsights = createAction(FETCH_INSIGHTS);
const editInsights = createAction(PUT_INSIGHTS);
const fetch_contents = createAction(FETCH_CONTENTS);
const all_contents = createAction(ALL_CONTENTS);
const single_content = createAction(SINGLE_CONTENTS);
const post_contents = createAction(POST_CONTENTS);
const put_contents = createAction(UPDATE_CONTENTS);

export default function requestProject(params) {
  return (dispatch) =>
    Dashboard.requestProjectsData(params)
      .then((data) => {
        dispatch(show(false));
        if (data?.data?.length > 0) {
          dispatch(setMessage('Loading...'));
        } else {
          dispatch(setMessage('No Record(s) found!'));
        }
        if (params?.filteredByBoard) {
          dispatch(taskView(data));
          dispatch(taskViewData({ data: data.data, errors: null }, FETCH_TASK_VIEW));
        } else {
          dispatch(fetchDashboardData(data));
          dispatch(dashboardData({ data: data.data, errors: null }, FETCH_DASHBOARD_DATA));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestProjectLiteView(params) {
  return (dispatch) =>
    Dashboard.getProjectLiteView(params)
      .then((data) => {
        dispatch(show(false));
        if (data?.data?.length > 0) {
          dispatch(setMessage('Loading...'));
        } else {
          dispatch(setMessage('No Record(s) found!'));
        }
        dispatch(dashboardLiteView(data));
        dispatch(dashboardLiteData({ data: data.data, errors: null }, FETCH_DASHBOARD_LITE));
      })
      .catch((error) => {
        handleErrorOnLitePages(error, dispatch);
      });
}

export function fetchProjectsInsight(params) {
  return (dispatch) =>
    Dashboard.requestProjectsInsights(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
        }
        dispatch(fetchInsights(data));
        dispatch(insightsData({ data: data.data, errors: null }, FETCH_INSIGHTS));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function updateProjectsInsight(params) {
  return (dispatch) =>
    Dashboard.editProjectInsight(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(showSuccessSnackbar(data?.data?.details));
        }
        dispatch(editInsights(data));
        dispatch(fetchProjectsInsight({ board_id: params.board_id }));
        // dispatch(
        //   insightsData({ data: data.data, errors: null }, PUT_INSIGHTS)
        // );
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestContentsList(params) {
  return (dispatch) =>
    Dashboard.fetchContents(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          // dispatch(showSuccessSnackbar(data?.data?.details));
        }
        if (params.fetchContent) {
          dispatch(single_content(data));
          dispatch(singleContentData({ data: data.data, errors: null }, SINGLE_CONTENTS));
        }
        if (params.id == null) {
          dispatch(all_contents(data));
          dispatch(allContentsData({ data: data.data, errors: null }, ALL_CONTENTS));
        } else {
          dispatch(fetch_contents(data));
          dispatch(contentsData({ data: data.data, errors: null }, FETCH_CONTENTS));
        }
      })
      .catch((error) => {
        handleErrorOnLitePages(error, dispatch);
      });
}

export function saveContent(params) {
  return (dispatch) =>
    Dashboard.sendContent(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(showSuccessSnackbar(data?.data?.details));
          dispatch(requestContentsList({ id: params.board, fetchContent: false }));
        }
        dispatch(post_contents(data));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function updateContent(params) {
  return (dispatch) =>
    Dashboard.editContent(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(showSuccessSnackbar(data?.data?.details));
          dispatch(
            requestContentsList({
              id: params.detach ? params.id : params.board,
              fetchContent: params.detach ? true : false,
            }),
          );
        }
        dispatch(put_contents(data));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}
