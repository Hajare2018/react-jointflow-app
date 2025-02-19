import { FETCH_ALL_TENANTS } from '../../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export function allTenantsData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ALL_TENANTS:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
