import {
  FETCH_NOTIFICATIONS,
  MAAP_LINK,
  REQUEST_LOGIN,
  RESET_PASSWORD,
  VENDOR_DETAILS,
} from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export default function loginData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case REQUEST_LOGIN:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function passwordData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case RESET_PASSWORD:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function vendorData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case VENDOR_DETAILS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function notificationsData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_NOTIFICATIONS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function maapLinkData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case MAAP_LINK:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
