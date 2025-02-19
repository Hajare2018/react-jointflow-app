import { FETCH_EVENTS } from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export default function eventsData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_EVENTS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
