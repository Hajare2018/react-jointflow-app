import { createAction } from 'redux-actions';
import {
  FETCH_NOTIFICATIONS,
  PASSWORD_RESET_MAIL,
  REASSIGN_OWNER,
  RESET_PASSWORD,
  VENDOR_DETAILS,
} from '../Constants/actionTypes';
import * as Login from '../../Api/login';
import { notificationsData, passwordData } from '../Reducers/login';
import { showSuccessSnackbar } from './snackbar';
import { setMessage, show } from './loader';
import { handleError, handleErrorOnLitePages } from '../../components/Utils';

const resetPassword = createAction(RESET_PASSWORD);
const vendor_details = createAction(VENDOR_DETAILS);
const fetch_notifications = createAction(FETCH_NOTIFICATIONS);
const password_reset_mail = createAction(PASSWORD_RESET_MAIL);
const reassign_owner = createAction(REASSIGN_OWNER);

const noFoundErr = 'Error: Request failed with status code 404';

export function doResetPassword(params) {
  return (dispatch) =>
    Login.patchPassword(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          dispatch(showSuccessSnackbar(data?.data?.details));
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        }
        dispatch(resetPassword(data));
        dispatch(passwordData({ data: data.data, errors: null }, RESET_PASSWORD));
      })
      .catch((error) => {
        dispatch(show(false));
        if (error.toString() == noFoundErr) {
          return;
        } else {
          handleError(error, dispatch);
        }
      });
}

export function getVendorDetails(params) {
  return (dispatch) =>
    Login.fetchVendorDetails(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
        }
        dispatch(resetPassword(data));
        dispatch(vendor_details({ data: data.data, errors: null }, VENDOR_DETAILS));
      })
      .catch((error) => {
        dispatch(show(false));
        if (error.toString() == noFoundErr) {
          return;
        } else {
          handleErrorOnLitePages(error, dispatch);
        }
      });
}

export function requestNotifications(params) {
  return (dispatch) =>
    Login.getNotifications(params)
      .then((data) => {
        dispatch(show(false));
        localStorage.setItem('all_notifications', JSON.stringify(data.data));
        dispatch(fetch_notifications(data));
        dispatch(notificationsData({ data: data.data, errors: null }, FETCH_NOTIFICATIONS));
        if (!data.data.length) {
          dispatch(setMessage('No Notifications!'));
        }
      })
      .catch((error) => {
        dispatch(show(false));
        handleErrorOnLitePages(error, dispatch);
      });
}

export function requestResetPassword(params) {
  return (dispatch) =>
    Login.passwordResetMail(params)
      .then((data) => {
        dispatch(show(false));
        dispatch(showSuccessSnackbar(data?.data?.details));
        localStorage.clear();
        dispatch(password_reset_mail(data));
      })
      .catch((error) => {
        dispatch(show(false));
        handleErrorOnLitePages(error, dispatch);
      });
}

export function requestReassignOwner(params) {
  return (dispatch) =>
    Login.reassignOwner(params)
      .then((data) => {
        dispatch(show(false));
        dispatch(showSuccessSnackbar(data?.data?.details));
        dispatch(reassign_owner(data));
      })
      .catch((error) => {
        dispatch(show(false));
        handleErrorOnLitePages(error, dispatch);
      });
}
