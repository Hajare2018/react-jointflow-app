import {
  FETCH_SINGLE_PROJECT,
  FETCH_SINGLE_PROJECT_HEADER,
  PUT_MEDDPICC,
  PUT_TASK_PREVIEW,
} from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export default function singleProjectData(state = INITIAL_STATE, action) {
  switch (action?.type) {
    case FETCH_SINGLE_PROJECT:
      return { ...state, data: action?.payload?.data, errors: null };
    default:
      return state;
  }
}

export function singleProjectWithHeader(state = INITIAL_STATE, action) {
  switch (action?.type) {
    case FETCH_SINGLE_PROJECT_HEADER:
      return { ...state, data: action?.payload?.data, errors: null };
    default:
      return state;
  }
}

export function taskPreviews(state = INITIAL_STATE, action) {
  switch (action?.type) {
    case PUT_TASK_PREVIEW:
      return { ...state, data: action?.payload?.data, errors: null };
    default:
      return state;
  }
}

export function meddpiccData(state = INITIAL_STATE, action) {
  switch (action?.type) {
    case PUT_MEDDPICC:
      return { ...state, data: action?.payload?.data, errors: null };
    default:
      return state;
  }
}
