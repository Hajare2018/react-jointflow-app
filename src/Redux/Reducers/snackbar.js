import {
  SHOW_SNACKBAR_SUCCESS,
  SHOW_SNACKBAR_ERROR,
  SHOW_SNACKBAR_INFO,
  SHOW_SNACKBAR_WARNING,
  HIDE_SNACKBAR,
  SHOW_ALERT_BOX,
} from '../Constants/actionTypes';

const INITIAL_STATE = { message: '', open: false, title: '', action: null, severity: null };

export default function snackbar(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SHOW_SNACKBAR_SUCCESS:
      return {
        ...state,
        message: action.payload.message,
        open: true,
        action: action.payload.action,
        severity: 'success',
      };

    case SHOW_SNACKBAR_ERROR:
      return {
        ...state,
        message: action.payload.message,
        open: true,
        action: action.payload.action,
        severity: 'error',
      };

    case SHOW_SNACKBAR_WARNING:
      return {
        ...state,
        message: action.payload.message,
        open: true,
        action: action.payload.action,
        severity: 'warning',
      };

    case SHOW_SNACKBAR_INFO:
      return {
        ...state,
        message: action.payload.message,
        open: true,
        action: action.payload.action,
        severity: 'info',
        vertical: 'top',
        horizontal: 'center',
      };

    case SHOW_ALERT_BOX:
      return {
        ...state,
        message: action.payload.message,
        open: true,
        action: action.payload.action,
      };

    case HIDE_SNACKBAR:
      return {
        ...state,
        message: '',
        open: false,
      };
    default:
      return state;
  }
}
