import { STORE_DATA } from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export function storedData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case STORE_DATA:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
