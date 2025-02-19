import {
  ALL_CONTENTS,
  FETCH_CONTENTS,
  FETCH_DASHBOARD_DATA,
  FETCH_DASHBOARD_LITE,
  FETCH_INSIGHTS,
  FETCH_LEGAL_TASKS,
  FETCH_TASK_VIEW,
  SINGLE_CONTENTS,
} from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export default function dashboardData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_DASHBOARD_DATA:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function dashboardLiteData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_DASHBOARD_LITE:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function taskViewData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_TASK_VIEW:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function legalTasksData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_LEGAL_TASKS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function insightsData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_INSIGHTS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function contentsData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_CONTENTS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function allContentsData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ALL_CONTENTS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function singleContentData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SINGLE_CONTENTS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
