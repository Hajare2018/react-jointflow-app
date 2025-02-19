import { CLONE_DOCUMENT, CLONE_PROJECT } from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export function clonedBoardData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CLONE_PROJECT:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;    
  }
}

export function clonedDocumentData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CLONE_DOCUMENT:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
