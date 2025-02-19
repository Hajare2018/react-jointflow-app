import {
  FETCH_ACCESS_GROUPS,
  FETCH_ACCESS_PERMISSIONS,
  FETCH_FORECAST,
  FETCH_GROUP_MAAP,
  FETCH_GROUP_PERMISSIONS,
  FETCH_ORG_HIERARCHY,
  FETCH_PERMISSIONS,
  FETCH_USER_HIERARCHY,
  MAAP_ACCESS,
  POST_ACCESS_GROUPS,
  REMOVE_ACCESS_GROUP,
  SINGLE_GROUP_ACCESS,
} from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export function userAccessGroups(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ACCESS_GROUPS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function singleAccessGroupData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SINGLE_GROUP_ACCESS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function postedAccessGroups(state = INITIAL_STATE, action) {
  switch (action.type) {
    case POST_ACCESS_GROUPS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function removedAccessGroup(state = INITIAL_STATE, action) {
  switch (action.type) {
    case REMOVE_ACCESS_GROUP:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function permissionsData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PERMISSIONS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function accessPermissionsData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ACCESS_PERMISSIONS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function groupPermissionsData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_GROUP_PERMISSIONS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function forecastData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_FORECAST:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function userHierarchyData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_USER_HIERARCHY:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function orgHierarchyData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ORG_HIERARCHY:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function maapAccessData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case MAAP_ACCESS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function groupViewData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_GROUP_MAAP:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
