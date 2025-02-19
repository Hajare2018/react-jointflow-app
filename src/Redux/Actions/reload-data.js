import { createAction } from 'redux-actions';
import { RELOAD_DATA } from '../Constants/actionTypes';

const doReload = createAction(RELOAD_DATA);

export function reload(data, action = null) {
  return (dispatch) => {
    dispatch(doReload({ data, action }));
  };
}
