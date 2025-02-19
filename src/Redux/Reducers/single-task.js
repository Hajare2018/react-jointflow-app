import { FETCH_FILTERED_TASKS, FETCH_SINGLE_CARD } from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export default function singleCardData(state = INITIAL_STATE, action) {
  switch (action?.type) {
    case FETCH_SINGLE_CARD:
      return { ...state, data: action?.payload?.data, errors: null };
    default:
      return state;
  }
}

export function filteredCardsData(state = INITIAL_STATE, action) {
  switch (action?.type) {
    case FETCH_FILTERED_TASKS:
      return { ...state, data: action?.payload?.data, errors: null };
    default:
      return state;
  }
}
