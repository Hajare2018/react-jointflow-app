import {
  GET_TOKEN_2,
  LOGIN_WITH_OTP,
  POST_OTP,
  REFRESH_TOKEN,
  REQUEST_SECRET_URL,
} from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export function secretUrlData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case REQUEST_SECRET_URL:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function postOtpData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case POST_OTP:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function token2Data(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_TOKEN_2:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function refreshTokenData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case REFRESH_TOKEN:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function loginWithOtpData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN_WITH_OTP:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
