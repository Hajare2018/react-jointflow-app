import { createAction } from 'redux-actions';
import {
  CREATE_SUPER_USER,
  CREATE_TENANT,
  SUB_DOMAIN_PROP,
  UUID_DATA,
} from '../Constants/actionTypes';
import * as Tenant from '../../Api/create-tenant';
import { displayDialog, show } from './loader';
import { showSuccessSnackbar } from './snackbar';
import {
  createdtenantData,
  subDomainProp,
  superUserData,
  uuidData,
} from '../Reducers/create-tenant';
import { handleError } from '../../components/Utils';

const createTenantAction = createAction(CREATE_TENANT);
const createSuperUserAction = createAction(CREATE_SUPER_USER);
const requestUuidData = createAction(UUID_DATA);
const subDomainPropAction = createAction(SUB_DOMAIN_PROP);

const noFoundErr = 'Error: Request failed with status code 404';

export function getUuidData(params) {
  return (dispatch) =>
    Tenant.getData(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
        }
        dispatch(requestUuidData(data));
        dispatch(uuidData({ data: data.data, errors: null }, CREATE_TENANT));
      })
      .catch((error) => {
        if (error.toString() == noFoundErr) {
          return;
        } else {
          handleError(error, dispatch);
        }
      });
}

export function createTenant(params) {
  return (dispatch) =>
    Tenant.postTenantData(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          if (data.status === 201) {
            dispatch(showSuccessSnackbar(data?.data?.details));
            setTimeout(() => {
              dispatch(displayDialog(true));
            }, 2000);
          }
        }
        dispatch(createTenantAction(data));
        dispatch(createdtenantData({ data: data.data, errors: null }, CREATE_TENANT));
      })
      .catch((error) => {
        if (error.toString() == noFoundErr) {
          return;
        } else {
          handleError(error, dispatch);
        }
      });
}

export function requestSubDomainProp(params) {
  return (dispatch) =>
    Tenant.postSubDomainUuid(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
        }
        dispatch(subDomainPropAction(data));
        dispatch(subDomainProp({ data: data.data, errors: null }, SUB_DOMAIN_PROP));
      })
      .catch((error) => {
        if (error.toString() == noFoundErr) {
          return;
        } else {
          handleError(error, dispatch);
        }
      });
}

export function createSuperUser(params) {
  return (dispatch) =>
    Tenant.postSuperUserData(params)
      .then((data) => {
        dispatch(show(false));
        // if (params.admin) {
        //   dispatch(showSuccessSnackbar(data?.data?.details));
        // } else {
        //   window.open("/confirmation/:user_created", "_self");
        // }
        dispatch(showSuccessSnackbar(data?.data?.details));
        dispatch(createSuperUserAction(data));
        dispatch(superUserData({ data: data.data, errors: null }, CREATE_SUPER_USER));
      })
      .catch((error) => {
        if (error.toString() == noFoundErr) {
          return;
        } else {
          handleError(error, dispatch);
        }
      });
}
