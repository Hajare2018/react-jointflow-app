import {
  CREATE_TENANT,
  CREATE_SUPER_USER,
  UUID_DATA,
  SUB_DOMAIN_PROP,
} from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export function uuidData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UUID_DATA:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function createdtenantData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_TENANT:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function superUserData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_SUPER_USER:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function subDomainProp(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SUB_DOMAIN_PROP:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
