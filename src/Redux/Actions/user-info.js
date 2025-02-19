import { createAction } from 'redux-actions';
import {
  CREATE_USER,
  FETCH_FULL_USERS,
  FETCH_SINGLE_USER,
  FETCH_TENANT_VALUES,
  FETCH_USER,
  UPDATE_LITE_USER,
  UPDATE_USER,
  FETCH_LIGHT_USERS,
  FETCH_TENANT_ATTRIBUTES,
  FETCH_SINGLE_TENANT_ATTRIBUTES,
  TEST_USER_EMAIL,
  BOARD_CUSTOM_ATTRIBUTES,
  COPY_MAAP_LINK,
} from '../Constants/actionTypes';
import * as Login from '../../Api/login';
import {
  allUsersData,
  createdUserData,
  singleUserData,
  tenantData,
  updatedLiteUserData,
  updatedUserData,
  userData,
  allLightUsersData,
  tenantAttributesData,
  singleTenantAttributesData,
  customAttributesData,
  copyMaapLinkData,
} from '../Reducers/user-info';
import { displayDialog, keepData, setMessage, show } from './loader';
import {
  showErrorSnackbar,
  showInfoSnackbar,
  showSuccessSnackbar,
  showWarningSnackbar,
} from './snackbar';
import { allPermissions } from './user-access';
import getSingleTask from './single-task';
import { fetchCrmDeals } from './crm-data';
import { handleError, handleErrorOnLitePages } from '../../components/Utils';

const requestUser = createAction(FETCH_USER);
const requestSingleUser = createAction(FETCH_SINGLE_USER);
const putUser = createAction(UPDATE_USER);
const saveUser = createAction(CREATE_USER);
const requestAllUsers = createAction(FETCH_FULL_USERS);
const requestLightUsers = createAction(FETCH_LIGHT_USERS);
const fetchTenantAttributes = createAction(FETCH_TENANT_VALUES);
const fetchTenantAttr = createAction(FETCH_TENANT_ATTRIBUTES);
const fetchSingleTenantAttr = createAction(FETCH_SINGLE_TENANT_ATTRIBUTES);
const test_user_email = createAction(TEST_USER_EMAIL);
const board_custom_attributes = createAction(BOARD_CUSTOM_ATTRIBUTES);
const maap_link = createAction(COPY_MAAP_LINK);

const notFoundErr = 'Error: Request failed with status code 404';

export function getUser(params) {
  return (dispatch) =>
    Login.fetchUser(params)
      .then((data) => {
        if (data) {
          if (params?.fetchPermissions) {
            dispatch(allPermissions({ user_id: data?.data?.id }));
          }
          if (params?.fetchSingleUser) {
            dispatch(getSingleUser({ id: data?.data?.id }));
          }
        }
        dispatch(requestUser(data));
        dispatch(userData({ data: data?.data, errors: null }, FETCH_USER));
      })
      .catch((error) => {
        handleErrorOnLitePages(error, dispatch);
      });
}

export function getSingleUser(params) {
  return (dispatch) =>
    Login.fetchSingleUser(params)
      .then((data) => {
        dispatch(requestSingleUser(data));
        dispatch(singleUserData({ data: data?.data, errors: null }, FETCH_USER));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function saveSlackId(params) {
  return (dispatch) =>
    Login.addSlackId(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(showSuccessSnackbar(data?.data?.details));
          dispatch(getUser({ fetchPermissions: false, isLightUser: false }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function newUser(params) {
  return (dispatch) =>
    Login.createUser(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(showSuccessSnackbar(data?.data?.details));
          if (params?.onlyStaff) {
            dispatch(getAllUsers({ onlyStaff: true }));
            setTimeout(() => {
              dispatch(displayDialog(true));
            }, 2000);
          } else if (params?.usersByCompany) {
            dispatch(
              getAllUsers({
                company_id: params?.company_id,
                usersByCompany: params?.usersByCompany,
              }),
            );
            dispatch(displayDialog(false));
          } else {
            dispatch(getAllUsers({ onlyStaff: false }));
            dispatch(displayDialog(false));
          }
        }
        dispatch(saveUser(data));
        dispatch(createdUserData({ data: data.data, errors: null }, CREATE_USER));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function editUser(params) {
  return (dispatch) =>
    Login.updateUser(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          if (params?.liteUI) {
            dispatch(
              getSingleTask({
                card_id: parseInt(params?.card_id),
                task_info: false,
              }),
            );
            dispatch(getUser({ fetchPermissions: false, isLightUser: true }));
          } else if (params?.onlyUser) {
            dispatch(getUser({ fetchPermissions: false, isLightUser: false }));
          } else if (params?.onlyStaff) {
            dispatch(getAllUsers({ onlyStaff: params?.onlyStaff }));
          } else if (!params?.onlyStaff) {
            dispatch(getAllUsers({ onlyStaff: false }));
          } else if (params?.onlyStaff__archived) {
            dispatch(getAllUsers({ onlyStaff__archived: params?.onlyStaff__archived }));
          } else if (!params?.onlyStaff__archived) {
            dispatch(getAllUsers({ onlyStaff__archived: false }));
          } else if (params?.user_info) {
            dispatch(getUser({ fetchPermissions: false, isLightUser: false }));
          }
          dispatch(showSuccessSnackbar(data?.data?.details));
        }
        dispatch(putUser(data));
        dispatch(updatedUserData({ data: data?.data?.details, errors: null }, UPDATE_USER));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function editLiteUser(params) {
  return (dispatch) =>
    Login.updateLiteUser(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(
            getSingleTask({
              card_id: parseInt(params?.card_id),
              task_info: false,
            }),
          );
          dispatch(showSuccessSnackbar(data?.data?.details));
        }
        dispatch(putUser(data));
        dispatch(updatedLiteUserData({ data: data?.data, errors: null }, UPDATE_LITE_USER));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function getAllUsers(params) {
  return (dispatch) =>
    Login.allUsers(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          if (!data?.data?.length) {
            dispatch(setMessage('No User(s) found!'));
          }
          if (data?.data?.details) {
            dispatch(showSuccessSnackbar(data?.data?.details));
          }
        }
        if (params.onlyStaff || params.onlyStaff__archived) {
          dispatch(requestAllUsers(data));
          dispatch(allUsersData({ data: data.data, errors: null }, FETCH_FULL_USERS));
        }
        if (params.usersByCompany) {
          dispatch(requestLightUsers(data));
          dispatch(allLightUsersData({ data: data.data, errors: null }, FETCH_LIGHT_USERS));
        }
        if (!params.onlyStaff || !params.onlyStaff__archived) {
          dispatch(requestLightUsers(data));
          dispatch(allLightUsersData({ data: data.data, errors: null }, FETCH_LIGHT_USERS));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestTenantData(params) {
  return (dispatch) =>
    Login.getTenantValuesByName(params)
      .then((data) => {
        if (params.keyword === 'board_custom_attributes') {
          localStorage.setItem('board_custom_attributes', JSON.stringify(data.data));
          dispatch(board_custom_attributes(data));
          dispatch(
            customAttributesData({ data: data.data, errors: null }, BOARD_CUSTOM_ATTRIBUTES),
          );
        }
        if (params.keyword === 'hubspot_import_stage') {
          dispatch(
            fetchCrmDeals({
              crm_name: 'hubspot',
              stage: data?.data?.[0]?.value_text,
              next: 0,
            }),
          );
        }
        if (params.keyword === 'mscrm_import_stage') {
          dispatch(
            fetchCrmDeals({
              crm_name: 'mscrm',
              stage: data?.data?.[0]?.value_text,
              next: 0,
            }),
          );
        }
        if (params.keyword === 'sfdc_import_stage') {
          dispatch(
            fetchCrmDeals({
              crm_name: 'salesforce',
              stage: data?.data?.[0]?.value_text,
              next: 0,
            }),
          );
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestTenantDataByName(params) {
  return (dispatch) =>
    Login.getTenantValuesByName(params)
      .then((data) => {
        dispatch(fetchTenantAttributes(data));
        dispatch(tenantData({ data: data.data, errors: null }, FETCH_TENANT_VALUES));
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestTenantAttributes(params) {
  return (dispatch) =>
    Login.getTenantAttributes(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          if (data?.data?.details) {
            dispatch(showSuccessSnackbar(data?.data?.details));
          }
          dispatch(fetchTenantAttr(data));
          dispatch(
            tenantAttributesData({ data: data.data, errors: null }, FETCH_TENANT_ATTRIBUTES),
          );
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function writeTenantAttributes(params) {
  return (dispatch) =>
    Login.sendTenantAttributes(params)
      .then((data) => {
        if (data) {
          dispatch(keepData(false));
          dispatch(requestTenantAttributes());
          dispatch(showSuccessSnackbar(data?.data?.details));
          dispatch(fetchSingleTenantAttr(data));
          dispatch(
            singleTenantAttributesData(
              { data: data.data, errors: null },
              FETCH_SINGLE_TENANT_ATTRIBUTES,
            ),
          );
        }
      })
      .catch((error) => {
        dispatch(keepData(true));
        handleError(error, dispatch);
      });
}

export function editTenantAttributes(params) {
  return (dispatch) =>
    Login.updateTenantAttributes(params)
      .then((data) => {
        if (data) {
          dispatch(keepData(false));
          dispatch(requestTenantAttributes());
          dispatch(showSuccessSnackbar(data?.data?.details));
          dispatch(fetchSingleTenantAttr(data));
          dispatch(
            singleTenantAttributesData(
              { data: data.data, errors: null },
              FETCH_SINGLE_TENANT_ATTRIBUTES,
            ),
          );
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestUserEmailTest(params) {
  return (dispatch) =>
    Login.test(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          if (data.status == 200) {
            dispatch(showSuccessSnackbar(data.data.details));
          } else if (data.status == 226) {
            dispatch(showWarningSnackbar(data.data.details));
          }
          dispatch(test_user_email(data));
        }
      })
      .catch((error) => {
        dispatch(show(false));
        if (error.toString() == notFoundErr) {
          dispatch(editUser({ id: params?.id, data: params?.data, onlyUser: true }));
          dispatch(showErrorSnackbar(error?.response?.data?.detail));
          return;
        } else {
          handleError(error, dispatch);
        }
      });
}

export function requestMaapLink(params) {
  return (dispatch) =>
    Login.maapLink(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          try {
            dispatch(maap_link(data));
            dispatch(copyMaapLinkData({ data: data.data, errors: null }, COPY_MAAP_LINK));
          } catch (error) {
            handleError(error, dispatch);
          }
          dispatch(showInfoSnackbar(data.data.details));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}

export function requestGroupViewLink(params) {
  return (dispatch) =>
    Login.groupViewLink(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          try {
            dispatch(maap_link(data));
            dispatch(copyMaapLinkData({ data: data.data, errors: null }, COPY_MAAP_LINK));
          } catch (error) {
            handleError(error, dispatch);
          }
          dispatch(showInfoSnackbar(data.data.details));
        }
      })
      .catch((error) => {
        handleError(error, dispatch);
      });
}
