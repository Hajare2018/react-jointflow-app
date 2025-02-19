import {
  EDIT_DOCUMENT,
  GET_CLAUSE_LIBRARY,
  GET_DOCUMENTS_DATA,
  GET_DOCUMENT_CLAUSES,
  GET_SINGLE_CLAUSE,
  SINGLE_CARD_DOCS,
  UPLOAD_DOCUMENT,
} from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export function uploadedDocs(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_DOCUMENTS_DATA:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function uploadDocument(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPLOAD_DOCUMENT:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function updatedDocument(state = INITIAL_STATE, action) {
  switch (action.type) {
    case EDIT_DOCUMENT:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function singleCardDocs(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SINGLE_CARD_DOCS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function clausesData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_DOCUMENT_CLAUSES:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function singleClausesData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_SINGLE_CLAUSE:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function clauseLibraryData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_CLAUSE_LIBRARY:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
