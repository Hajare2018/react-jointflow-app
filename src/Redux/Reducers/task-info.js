import {
  CREATE_TASK_STEPS,
  EDIT_TASK_STEPS,
  FETCH_ASSIGNEES,
  FETCH_TASK_STEPS,
  POPULATE_FROM_TYPE,
  PROMPT_CONTEXT,
  SAVE_TASK_INFO,
  SINGLE_TASK_STEPS,
} from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export default function saveTasksData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SAVE_TASK_INFO:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function assigneesData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ASSIGNEES:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function taskStepData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_TASK_STEPS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function singleTaskStepData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SINGLE_TASK_STEPS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function createdStepData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_TASK_STEPS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function updatedStepData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case EDIT_TASK_STEPS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function promptContextData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case PROMPT_CONTEXT:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function populatedFromType(state = INITIAL_STATE, action) {
  switch (action.type) {
    case POPULATE_FROM_TYPE:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
