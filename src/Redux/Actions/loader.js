import { createAction } from 'redux-actions';
import {
  TOGGLE_DIALOG,
  SHOW_LOADER,
  TOGGLE_COMPANIES,
  KEEP_TEXT,
  SET_MESSAGE,
  QUARTER_DETAILS,
  MONTHLY_DETAILS,
  SHOW_PROMPT,
  SELECTED_USER,
  RESTART_PROMPT,
} from '../Constants/actionTypes';

const showLoading = createAction(SHOW_LOADER);
const toggleDialog = createAction(TOGGLE_DIALOG);
const toggleCompanies = createAction(TOGGLE_COMPANIES);
const keepText = createAction(KEEP_TEXT);
const createMessage = createAction(SET_MESSAGE);
const quarterDetails = createAction(QUARTER_DETAILS);
const monthlyDetails = createAction(MONTHLY_DETAILS);
const togglePrompt = createAction(SHOW_PROMPT);
const restartPrompt = createAction(RESTART_PROMPT);
const selected_user = createAction(SELECTED_USER);

export function show(show, action = null) {
  return (dispatch) => {
    dispatch(showLoading({ show, action }));
  };
}

export function displayDialog(show, action = null) {
  return (dispatch) => {
    dispatch(toggleDialog({ show, action }));
  };
}

export function displayCompanies(show, action = null) {
  return (dispatch) => {
    dispatch(toggleCompanies({ show, action }));
  };
}

export function showPrompt(show, action = null) {
  return (dispatch) => {
    dispatch(togglePrompt({ show, action }));
  };
}

export function keepData(show, action = null) {
  return (dispatch) => {
    dispatch(keepText({ show, action }));
  };
}

export function setMessage(message, action = null) {
  return (dispatch) => {
    dispatch(createMessage({ message, action }));
  };
}

export function setQuarterData(data, action = null) {
  return (dispatch) => {
    dispatch(quarterDetails({ data, action }));
  };
}

export function setMonthlyData(data, action = null) {
  return (dispatch) => {
    dispatch(monthlyDetails({ data, action }));
  };
}

export function doSelectUser(user, action = null) {
  return (dispatch) => {
    dispatch(selected_user({ user, action }));
  };
}

export function showRestartPrompt(show, action = null) {
  return (dispatch) => {
    dispatch(restartPrompt({ show, action }));
  };
}
