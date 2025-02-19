import { RELOAD_DATA } from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export function reloadedData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case RELOAD_DATA:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
