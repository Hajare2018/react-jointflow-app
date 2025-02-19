import {
  FETCH_CRM_DEALS,
  FETCH_CRM_COMPANY,
  FETCH_CRM_CONTACTS,
  FETCH_CRM_CONNECTIONS,
  FETCH_CRM_STATUS,
  CRM_SYNC,
  FETCH_SINGLE_CRM,
  FETCH_CRM_DEALS_SEARCH,
} from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };
console.log("Initial state", INITIAL_STATE);

export function crmDealsData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_CRM_DEALS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
export function crmDealsDataBySearch(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_CRM_DEALS_SEARCH:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function singleCrmData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_SINGLE_CRM:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function crmCompanyData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_CRM_COMPANY:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function crmContactData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_CRM_CONTACTS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function crmConnectedData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_CRM_CONNECTIONS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function crmStatusData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_CRM_STATUS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function crmSyncData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CRM_SYNC:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
