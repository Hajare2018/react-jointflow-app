import { UPDATE_TASK_INFO } from '../Constants/actionTypes';

const INITIAL_STATE = { data: {}, errors: null };

export default function updatedTasksData(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_TASK_INFO:
      return { ...state, data: action.payload.data, errors: null };
    default:
      return state;
  }
}
