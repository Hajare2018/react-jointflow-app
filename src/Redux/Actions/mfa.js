import { createAction } from 'redux-actions';
import {
  NEW_PASSWORD_EMAIL,
  POST_OTP,
  REQUEST_SECRET_URL,
  RESET_USER_MFA,
} from '../Constants/actionTypes';
import * as mfa from '../../Api/mfa';
import { show } from './loader';
import { showErrorSnackbar, showSuccessSnackbar, showWarningSnackbar } from './snackbar';
import { secretUrlData } from '../Reducers/mfa';
import { handleError } from '../../components/Utils';

const getUrl = createAction(REQUEST_SECRET_URL);
const saveOtp = createAction(POST_OTP);
const newPasswordMail = createAction(NEW_PASSWORD_EMAIL);
const resetMFA = createAction(RESET_USER_MFA);

const noFoundErr = 'Error: Request failed with status code 404';

export default function putSecretUrl(params) {
  return (dispatch) =>
    mfa
      .getSecretUrl(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
        }
        dispatch(getUrl(data));
        dispatch(secretUrlData({ data: data.data, errors: null }, REQUEST_SECRET_URL));
      })
      .catch((error) => {
        dispatch(show(false));
        if (error.toString() == noFoundErr) {
          dispatch(showErrorSnackbar('Something went wrong!'));
          return;
        } else {
          handleError(error, dispatch);
        }
      });
}

export function submitOtp(params) {
  return (dispatch) =>
    mfa
      .sendOtp(params)
      .then((data) => {
        if (data) {
          dispatch(show(false));
          if (data?.status === 200) {
            dispatch(showSuccessSnackbar(data?.data?.details));
          }
          if (data?.status === 202) {
            dispatch(showWarningSnackbar(data?.data?.details));
          }
        }
        dispatch(saveOtp(data));
      })
      .catch((error) => {
        dispatch(show(false));
        if (error.toString() == noFoundErr) {
          dispatch(showErrorSnackbar('Something went wrong!'));
          return;
        } else {
          handleError(error, dispatch);
        }
      });
}

export function requestNewPassword(params) {
  return (dispatch) =>
    mfa
      .postNewPasswordEmail(params)
      .then((data) => {
        dispatch(showSuccessSnackbar(data?.data?.details));
        dispatch(newPasswordMail(data));
      })
      .catch((error) => {
        dispatch(show(false));
        if (error.toString() == noFoundErr) {
          dispatch(showErrorSnackbar('Something went wrong!'));
          return;
        } else {
          handleError(error, dispatch);
        }
      });
}

export function requestResetMFA(params) {
  return (dispatch) =>
    mfa
      .postResetMFAEmail(params)
      .then((data) => {
        dispatch(showSuccessSnackbar(data?.data?.details));
        dispatch(resetMFA(data));
      })
      .catch((error) => {
        dispatch(show(false));
        if (error.toString() == noFoundErr) {
          dispatch(showErrorSnackbar('Something went wrong!'));
          return;
        } else {
          handleError(error, dispatch);
        }
      });
}
