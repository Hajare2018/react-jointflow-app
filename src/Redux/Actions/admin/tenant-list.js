import { createAction } from 'redux-actions';
import * as Admin from '../../../Api/admin/tenant-list';
import { handleError } from '../../../components/Utils';
import { FETCH_ALL_TENANTS, SAVE_TENANT } from '../../Constants/actionTypes';
import { allTenantsData } from '../../Reducers/admin/tenant-list';
import { show } from '../loader';
import { showSuccessSnackbar } from '../snackbar';

const all_tenants = createAction(FETCH_ALL_TENANTS);
const new_tenant = createAction(SAVE_TENANT);

const noFoundErr = 'Error: Request failed with status code 404';

export function requestAllTenants(params) {
  return (dispatch) =>
    Admin.fetchTenants(params)
      .then((data) => {
        dispatch(show(false));
        dispatch(all_tenants(data));
        dispatch(allTenantsData({ data: data.data, errors: null }, FETCH_ALL_TENANTS));
      })
      .catch((error) => {
        dispatch(show(false));
        if (error.toString() === noFoundErr) {
          return;
        } else {
          handleError(error, dispatch);
        }
      });
}

export function saveTenant(params) {
  return (dispatch) =>
    Admin.newTenant(params)
      .then((data) => {
        dispatch(show(false));
        dispatch(requestAllTenants());
        dispatch(new_tenant(data));
        dispatch(showSuccessSnackbar(data?.data?.details));
      })
      .catch((error) => {
        dispatch(show(false));
        if (error.toString() === noFoundErr) {
          return;
        } else {
          handleError(error, dispatch);
        }
      });
}
