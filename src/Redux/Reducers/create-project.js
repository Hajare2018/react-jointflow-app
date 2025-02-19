import {
  CREATE_PROJECT,
  FETCH_ANOTHER_STATUSES,
  FETCH_SINGLE_STATUS,
  FETCH_STATUSES,
  FETCH_TAGS,
  POST_CUSTOM_ATTRIBUTES,
  PUT_FORM_VALUES,
} from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export default function projectData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_PROJECT:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function tagsData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_TAGS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function formValuesData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case PUT_FORM_VALUES:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function boardCustomAttributesData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case POST_CUSTOM_ATTRIBUTES:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function statusesData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_STATUSES:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function anotherStatusesData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ANOTHER_STATUSES:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function singleStatusData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_SINGLE_STATUS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
