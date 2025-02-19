import {
  CURRENT_PATH,
  KEEP_TEXT,
  MONTHLY_DETAILS,
  QUARTER_DETAILS,
  RESTART_PROMPT,
  SELECTED_USER,
  SET_MESSAGE,
  SHOW_LOADER,
  SHOW_PROMPT,
  TOGGLE_COMPANIES,
  TOGGLE_DIALOG,
} from '../Constants/actionTypes';

const INITIAL_STATE = { show: false, errors: null };
const DIALOG_STATE = { show: false, errors: null };
const PROMPT_STATE = { show: false, errors: null };
const COMPANY_STATE = { show: false, errors: null };
const RESTART_STATE = { show: false, errors: null };
const TEXT_STATE = { show: false, errors: null };
const PATH_STATE = { data: '', errors: null };
const MESSAGE_STATE = { message: '', errors: null };
const DATA_STATE = { data: {}, errors: null };
const USER_STATE = { selected: false, errors: null };

export function showLoader(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SHOW_LOADER:
      return { ...state, show: action.payload.show, errors: null };
    default:
      return state;
  }
}

export function dialog(state = DIALOG_STATE, action) {
  switch (action.type) {
    case TOGGLE_DIALOG:
      return { ...state, show: action.payload.show, errors: null };
    default:
      return state;
  }
}

export function companies(state = COMPANY_STATE, action) {
  switch (action.type) {
    case TOGGLE_COMPANIES:
      return { ...state, show: action.payload.show, errors: null };
    default:
      return state;
  }
}

export function pathname(state = PATH_STATE, action) {
  switch (action.type) {
    case CURRENT_PATH:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function keepThis(state = TEXT_STATE, action) {
  switch (action.type) {
    case KEEP_TEXT:
      return { ...state, show: action.payload.show, errors: null };
    default:
      return state;
  }
}

export function messageData(state = MESSAGE_STATE, action) {
  switch (action.type) {
    case SET_MESSAGE:
      return { message: action.payload.message, errors: null };
    default:
      return state;
  }
}

export function quarterData(state = DATA_STATE, action) {
  switch (action.type) {
    case QUARTER_DETAILS:
      return { data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function monthlyData(state = DATA_STATE, action) {
  switch (action.type) {
    case MONTHLY_DETAILS:
      return { data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function promptData(state = PROMPT_STATE, action) {
  switch (action.type) {
    case SHOW_PROMPT:
      return { show: action.payload.show, errors: null };
    default:
      return state;
  }
}

export function isUserSelected(state = USER_STATE, action) {
  switch (action.type) {
    case SELECTED_USER:
      return { user: action.payload.user, errors: null };
    default:
      return state;
  }
}

export function restart(state = RESTART_STATE, action) {
  switch (action.type) {
    case RESTART_PROMPT:
      return { ...state, show: action.payload.show, errors: null };
    default:
      return state;
  }
}
