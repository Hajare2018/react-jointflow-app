import { createAction } from 'redux-actions';
import {
  FETCH_ACCESS_GROUPS,
  FETCH_ACCESS_PERMISSIONS,
  FETCH_FORECAST,
  FETCH_GROUP_MAAP,
  FETCH_ORG_HIERARCHY,
  FETCH_PERMISSIONS,
  FETCH_USER_HIERARCHY,
  MAAP_ACCESS,
  POST_ACCESS_GROUPS,
  REASSIGN_USER,
  REMOVE_ACCESS_GROUP,
  SINGLE_GROUP_ACCESS,
} from '../Constants/actionTypes';
import * as Access from '../../Api/user-access';
import { show } from './loader';
import { showSuccessSnackbar } from './snackbar';
import {
  accessPermissionsData,
  forecastData,
  groupViewData,
  maapAccessData,
  orgHierarchyData,
  permissionsData,
  postedAccessGroups,
  removedAccessGroup,
  singleAccessGroupData,
  userAccessGroups,
  userHierarchyData,
} from '../Reducers/user-access';
import { getAllUsers } from './user-info';
import { handleError, handleErrorOnLitePages } from '../../components/Utils';
import requestSingleProject from './single-project';

const requestUserAccess = createAction(FETCH_ACCESS_GROUPS);
const sendUserAccess = createAction(POST_ACCESS_GROUPS);
const removeUserAccessGroup = createAction(REMOVE_ACCESS_GROUP);
const requestUserPermissions = createAction(FETCH_PERMISSIONS);
const requestSingleGroupAccess = createAction(SINGLE_GROUP_ACCESS);
const requestPermissions = createAction(FETCH_ACCESS_PERMISSIONS);
const forecast = createAction(FETCH_FORECAST);
const user_hierarchy = createAction(FETCH_USER_HIERARCHY);
const org_hierarchy = createAction(FETCH_ORG_HIERARCHY);
const maap_access = createAction(MAAP_ACCESS);
const group_view = createAction(FETCH_GROUP_MAAP);
const reassign_user = createAction(REASSIGN_USER);

export function getAccessGroups(params) {
  return (dispatch) =>
    Access.getUserAccess(params)
      .then((data) => {
        if (data) {
          dispatch(requestUserAccess(data));
          dispatch(userAccessGroups({ data: data?.data, errors: null }, FETCH_ACCESS_GROUPS));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function singleAccessGroup(params) {
  return (dispatch) =>
    Access.singleGroupAccess(params)
      .then((data) => {
        if (data) {
          dispatch(requestSingleGroupAccess(data));
          dispatch(singleAccessGroupData({ data: data?.data, errors: null }, SINGLE_GROUP_ACCESS));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function createGroupAccess(params) {
  return (dispatch) =>
    Access.saveGroupAccess(params)
      .then((data) => {
        if (data) {
          dispatch(showSuccessSnackbar(data?.data?.details));
          dispatch(getAccessGroups());
          dispatch(requestSingleGroupAccess(data));
          dispatch(singleAccessGroupData({ data: data?.data, errors: null }, SINGLE_GROUP_ACCESS));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function updateGroupAccess(params) {
  return (dispatch) =>
    Access.editGroupAccess(params)
      .then((data) => {
        if (data) {
          dispatch(showSuccessSnackbar(data?.data?.details));
          dispatch(getAccessGroups());
          dispatch(requestSingleGroupAccess(data));
          dispatch(singleAccessGroupData({ data: data?.data, errors: null }, SINGLE_GROUP_ACCESS));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function saveAccessGroup(params) {
  return (dispatch) =>
    Access.postUserAccess(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(getAllUsers({ onlyStaff: true }));
          dispatch(showSuccessSnackbar(data?.data?.details));
          dispatch(sendUserAccess(data));
          dispatch(postedAccessGroups({ data: data?.data, errors: null }, POST_ACCESS_GROUPS));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function deleteAccessGroup(params) {
  return (dispatch) =>
    Access.removeUserAccess(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(showSuccessSnackbar('Removed successfully!'));
          dispatch(removeUserAccessGroup(data));
          dispatch(removedAccessGroup({ data: data?.data, errors: null }, REMOVE_ACCESS_GROUP));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function allPermissions(params) {
  return (dispatch) =>
    Access.getPermissions(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(requestUserPermissions(data));
          dispatch(permissionsData({ data: data?.data, errors: null }, FETCH_PERMISSIONS));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function getPermissionsList(params) {
  return (dispatch) =>
    Access.getAccessPermissions(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(requestPermissions(data));
          dispatch(
            accessPermissionsData({ data: data?.data, errors: null }, FETCH_ACCESS_PERMISSIONS),
          );
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function addGroupPermissions(params) {
  return (dispatch) =>
    Access.saveGroupPermissions(params)
      .then((data) => {
        if (data) {
          // dispatch(show(false))
          dispatch(showSuccessSnackbar(data?.data?.details));
          dispatch(getAccessGroups());
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function deleteGroupPermissions(params) {
  return (dispatch) =>
    Access.deleteGroupPermissions(params)
      .then((data) => {
        if (data) {
          // dispatch(show(false))
          dispatch(showSuccessSnackbar(data?.data?.details));
          dispatch(getAccessGroups());
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function loadForecast(params) {
  return (dispatch) =>
    Access.getForecast(params)
      .then((data) => {
        if (data) {
          dispatch(forecast(data));
          dispatch(forecastData({ data: data?.data, errors: null }, FETCH_FORECAST));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestUserHierarchy(params) {
  return (dispatch) =>
    Access.getUserHeirarchy(params)
      .then((data) => {
        if (data) {
          dispatch(user_hierarchy(data));
          dispatch(userHierarchyData({ data: data?.data, errors: null }, FETCH_USER_HIERARCHY));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestOrgHierarchy(params) {
  return (dispatch) =>
    Access.getOrgHeirarchy(params)
      .then((data) => {
        if (data) {
          dispatch(org_hierarchy(data));
          dispatch(orgHierarchyData({ data: data?.data, errors: null }, FETCH_ORG_HIERARCHY));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestMaapAccess(params) {
  return (dispatch) =>
    Access.maapAccess(params)
      .then((data) => {
        if (data) {
          dispatch(showSuccessSnackbar(data?.data?.details));
          requestSingleProject({ id: params.board_id });
          dispatch(maap_access(data));
          dispatch(maapAccessData({ data: data?.data, errors: null }, MAAP_ACCESS));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestGroupView(params) {
  return (dispatch) =>
    Access.groupView(params)
      .then((data) => {
        if (data) {
          dispatch(group_view(data));
          dispatch(groupViewData({ data: data?.data, errors: null }, FETCH_GROUP_MAAP));
        }
      })
      .catch((error) => {
        handleErrorOnLitePages(error, dispatch);
      });
}

export function requestReassignUser(params) {
  return (dispatch) =>
    Access.reassignUser(params)
      .then((data) => {
        if (data) {
          dispatch(reassign_user(data));
          dispatch(showSuccessSnackbar(data?.data?.details));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}
