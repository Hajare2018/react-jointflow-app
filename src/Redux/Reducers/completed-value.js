import { COMPLETED_DATA } from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export function completedData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case COMPLETED_DATA:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
