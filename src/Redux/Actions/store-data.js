import { createAction } from 'redux-actions';
import { STORE_DATA } from '../Constants/actionTypes';

const storeData = createAction(STORE_DATA);

export function fetchData(data, action = null) {
  return (dispatch) => {
    dispatch(storeData({ data, action }));
  };
}
