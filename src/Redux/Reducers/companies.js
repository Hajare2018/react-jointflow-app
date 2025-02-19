import {
  FETCH_COMPANIES,
  CREATE_COMPANY,
  COMPANY_FAV_ICON,
  COMPANY_DETAILS,
  GIVE_COMPANY_ACCESS,
  FETCH_COMPANY_HIERARCHY,
} from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export function companiesData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_COMPANIES:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function createdCompany(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_COMPANY:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function companyFavIcon(state = INITIAL_STATE, action) {
  switch (action.type) {
    case COMPANY_FAV_ICON:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function companyData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case COMPANY_DETAILS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function companyAccessData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GIVE_COMPANY_ACCESS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function companyHierarchyData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_COMPANY_HIERARCHY:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
