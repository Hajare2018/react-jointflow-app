import {
  CREATE_DEAL_POLICE,
  FETCH_DEAL_POLICE,
  UPDATE_DEAL_POLICE,
} from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export function dealPoliceData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_DEAL_POLICE:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function createdDealPoliceData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_DEAL_POLICE:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}

export function updatedPoliceData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_DEAL_POLICE:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
