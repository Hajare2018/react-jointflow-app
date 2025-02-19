import { POST_MAIL, REACTIVATE_LINK, RESET_PASSWORD_MAIL } from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export function nudgeData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case POST_MAIL:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function activationEmailData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case REACTIVATE_LINK:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function resetPasswordData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case RESET_PASSWORD_MAIL:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
