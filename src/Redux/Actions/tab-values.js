import { createAction } from 'redux-actions';
import { SET_TAB_VALUE } from '../Constants/actionTypes';

const tabVal = createAction(SET_TAB_VALUE);

export function handleTabsChange(data, action = null) {
  return (dispatch) => {
    dispatch(tabVal({ data, action }));
  };
}
