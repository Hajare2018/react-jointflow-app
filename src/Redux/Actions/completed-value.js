import { createAction } from 'redux-actions';
import { COMPLETED_DATA } from '../Constants/actionTypes';

const status = createAction(COMPLETED_DATA);

export function completed(data, action = null) {
  return (dispatch) => {
    dispatch(status({ data, action }));
  };
}
