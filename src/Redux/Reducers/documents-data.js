import {
  FETCH_CRM_PROJECTS,
  FETCH_DOCUMENTS_DATA,
  FETCH_PROJECTS_BY_COMPANY,
  FETCH_PROJECTS_IN_LITE_VIEW,
  FETCH_SUNBURST_DATA,
  FETCH_TEMPLATES_DATA,
} from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export default function documentsData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_DOCUMENTS_DATA:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function crmProjectsData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_CRM_PROJECTS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function sunburstData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_SUNBURST_DATA:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function templatesData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_TEMPLATES_DATA:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function liteViewProjectsData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PROJECTS_IN_LITE_VIEW:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function ProjectsByCompanyData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_PROJECTS_BY_COMPANY:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
