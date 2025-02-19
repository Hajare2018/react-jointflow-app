import { FETCH_DOCUMENTS_TYPE, FETCH_SINGLE_DOCUMENTS_TYPE } from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export default function documentsType(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_DOCUMENTS_TYPE:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function documentsTypeData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_SINGLE_DOCUMENTS_TYPE:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
