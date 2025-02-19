import {
  CREATE_BOARD_COMMENTS,
  CREATE_COMMENTS,
  FETCH_BOARD_COMMENTS,
  FETCH_COMMENTS,
  UPDATE_BOARD_COMMENT,
  UPDATE_COMMENT,
} from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export function commentsData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_COMMENTS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function boardCommentsData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_BOARD_COMMENTS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function postedComments(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_COMMENTS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function postedBoardComments(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_BOARD_COMMENTS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function updatedComments(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_COMMENT:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function updatedBoardComments(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_BOARD_COMMENT:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
