import { SET_TAB_VALUE } from '../Constants/actionTypes';

const INITIAL_STATE = { value: 0, errors: null };

export function tabValues(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_TAB_VALUE:
      return { ...state, value: action.payload.data, errors: null };
    default:
      return state;
  }
}
