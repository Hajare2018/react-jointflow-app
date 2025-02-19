import { createAction } from 'redux-actions';
import {
  SHOW_SNACKBAR_SUCCESS,
  SHOW_SNACKBAR_ERROR,
  HIDE_SNACKBAR,
  SHOW_SNACKBAR_WARNING,
  SHOW_SNACKBAR_INFO,
} from '../Constants/actionTypes';

const showSnackbarSuccess = createAction(SHOW_SNACKBAR_SUCCESS);
const showSnackbarError = createAction(SHOW_SNACKBAR_ERROR);
const hideSnackbar = createAction(HIDE_SNACKBAR);
const showSnackbarWarning = createAction(SHOW_SNACKBAR_WARNING);
const showSnackbarInfo = createAction(SHOW_SNACKBAR_INFO);

export function showSuccessSnackbar(message, action = null) {
  return (dispatch) => dispatch(showSnackbarSuccess({ message, action }));
}

export function showErrorSnackbar(message, action = null) {
  return (dispatch) => dispatch(showSnackbarError({ message, action }));
}

export function showWarningSnackbar(message, action = null) {
  return (dispatch) => dispatch(showSnackbarWarning({ message, action }));
}

export function showInfoSnackbar(message, action = null) {
  return (dispatch) => dispatch(showSnackbarInfo({ message, action }));
}

export function hideSnackbarMessage() {
  return (dispatch) => dispatch(hideSnackbar());
}
