import {
  FETCH_USER,
  UPDATE_USER,
  CREATE_USER,
  FETCH_TENANT_VALUES,
  UPDATE_LITE_USER,
  FETCH_SINGLE_USER,
  FETCH_FULL_USERS,
  FETCH_LIGHT_USERS,
  FETCH_TENANT_ATTRIBUTES,
  FETCH_SINGLE_TENANT_ATTRIBUTES,
  CREATE_TENANT_ATTRIBUTES,
  UPDATE_TENANT_ATTRIBUTES,
  BOARD_CUSTOM_ATTRIBUTES,
  COPY_MAAP_LINK,
} from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export function userData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_USER:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function singleUserData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_SINGLE_USER:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function createdUserData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_USER:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function updatedUserData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_USER:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function updatedLiteUserData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_LITE_USER:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function allUsersData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_FULL_USERS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function allLightUsersData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_LIGHT_USERS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function tenantData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_TENANT_VALUES:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function tenantAttributesData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_TENANT_ATTRIBUTES:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function singleTenantAttributesData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_SINGLE_TENANT_ATTRIBUTES:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function createdTenantAttributesData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_TENANT_ATTRIBUTES:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function updatedTenantAttributesData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_TENANT_ATTRIBUTES:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function customAttributesData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case BOARD_CUSTOM_ATTRIBUTES:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function copyMaapLinkData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case COPY_MAAP_LINK:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
